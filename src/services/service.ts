import { useAuthStore } from '@/stores/auth.store';
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { toast } from 'sonner';
import { authService } from './auth.service';

// ==================== Configuration ====================
// hostname is used to check if the app is running on staging or production
const baseURL: string = import.meta.env.VITE_BASE_URL;

// ==================== Axios Instance ====================
const service: AxiosInstance = axios.create({
  baseURL,
  timeout: 120000,
  // Required so the browser sends the httpOnly refreshToken cookie on
  // requests to the API (login sets it, /auth/refresh-token consumes it).
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  },
});

// ==================== Token Refresh (single-flight) ====================
// The refreshToken is not returned by login — it lives in an httpOnly cookie,
// so the client never reads or stores it. `authService.refreshToken` calls
// /auth/refresh-token with credentials and returns a fresh accessToken.

// Shared in-flight refresh so concurrent 401s trigger exactly one refresh call
// (avoids racing multiple refreshes and invalidating the rotating cookie).
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = authService
      .refreshToken()
      .then((data) => data?.accessToken ?? null)
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

// ==================== Request Interceptor (Add Auth Token) ====================
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const access = useAuthStore.getState().accessToken;

    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ==================== Response Interceptor (Handle Token Refresh) ====================
service.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (AxiosRequestConfig & {
      _retry?: boolean;
    }) | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Auth endpoints must not trigger a refresh (login failure / refresh failure
    // should surface directly rather than loop).
    const isAuthRequest =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh');

    // If 401 (Unauthorized), not already retried, and NOT an auth request,
    // attempt a token refresh using the httpOnly cookie.
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true; // Mark request as retried

      const accessToken = await refreshAccessToken();

      if (accessToken) {
        useAuthStore.getState().setAccessToken(accessToken);
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return service(originalRequest);
      }

      // Refresh failed → the session (refresh cookie) is truly expired.
      toast.error('Session expired. Please login again.');
      useAuthStore.getState().resetState();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default service;

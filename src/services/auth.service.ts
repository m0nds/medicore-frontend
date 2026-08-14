import type { ForgotPasswordPayload, LoginPayload, LoginResponse, RegisterPayload, ResetPasswordPayload } from "@/types/auth.type";
import type { ApiResponse } from "@/types";
import service from "./service";

export const authService = {
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await service.post<LoginResponse>(`/auth/login`, data);
    return response.data
  },
  register: async (data: RegisterPayload) => {
    const response = await service.post(`/auth/register`, data);
    return response.data
  },
  verifyEmail: async (token: string) => {
    const response = await service.get(`/auth/verify?token=${token}`);
    return response.data
  },
  forgotPassword: async (data: ForgotPasswordPayload) => {
    const response = await service.post(`/auth/forgot-password`, data);
    return response.data;
  },
  resetPassword: async (data: ResetPasswordPayload) => {
    const response = await service.post(`/auth/reset-password`, data);
    return response.data;
  },
  // No body needed — the refreshToken rides along in the httpOnly cookie.
  // Returns only a fresh accessToken; /auth/refresh is excluded from the
  // response interceptor's refresh retry, so routing it through `service` is safe.
  refreshToken: async (): Promise<{ accessToken: string }> => {
    // Unwrap the ApiResponse envelope — the token is at response.data.data,
    // not response.data (which is { success, message, data }).
    const response = await service.post<ApiResponse<{ accessToken: string }>>(`/auth/refresh`);
    return response.data.data;
  },
  logout: async () => {
    const response = await service.post(`/auth/logout`);
    return response.data;
  }
}
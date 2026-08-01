import type { ForgotPasswordPayload, LoginPayload, LoginResponse, RegisterPayload, ResetPasswordPayload } from "@/types/auth.type";
import service from "./service";

export const authService = {
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await service.post(`/auth/login`, data);
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
  // Returns only a fresh accessToken; /auth/refresh-token is excluded from the
  // response interceptor's refresh retry, so routing it through `service` is safe.
  refreshToken: async (): Promise<{ accessToken: string }> => {
    const response = await service.post(`/auth/refresh-token`);
    return response.data;
  },
}
import type { Role } from ".";
import type { User } from "./user.type";

type UserResponse = Omit<User, 'patient' | 'doctor' | 'receptionist'>;

export interface RegisterPayload {
  name: string;
  email: string;
  role: Role;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}


export interface LoginResponse {
  data: {
    accessToken: string;
    user: UserResponse;
  }
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
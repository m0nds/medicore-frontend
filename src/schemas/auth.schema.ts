import type { Role } from "@/types";
import z from "zod";

export const loginSchema = z.object({
  email: z.string({ error: 'Email is required' }).email({ error: "Invalid email" }),
  password: z.string({ error: 'Password is required' }).min(8, { error: "Password must be at least 8 characters long" }),
}).strict();

export const registerSchema = z.object({
  name: z.string({ error: 'Name is required' }).min(3, { error: "Name must be at least 3 characters long" }),
  email: z.string({ error: 'Email is required' }).email({ error: "Invalid email" }),
  password: z.string({ error: 'Password is required' }).min(8, { error: "Password must be at least 8 characters long" }),
  confirmPassword: z.string({ error: 'Confirm password is required' }).min(8, { error: "Confirm password must be at least 8 characters long" }),
  role: z.enum(['PATIENT', 'DOCTOR', 'RECEPTIONIST'] as Role[], { error: 'Invalid role' }),
}).strict();

export const forgotPasswordSchema = z.object({
  email: z.string({ error: 'Email is required' }).email({ error: "Invalid email" }),
}).strict();

export const resetPasswordSchema = z.object({
  token: z.string({ error: 'Token is required' }),
  newPassword: z.string({ error: 'New password is required' }).min(8, { error: "New password must be at least 8 characters long" }),
  confirmPassword: z.string({ error: 'Confirm password is required' }).min(8, { error: "Confirm password must be at least 8 characters long" }),
}).strict();

export type LoginBody = z.infer<typeof loginSchema>;
export type RegisterBody = z.infer<typeof registerSchema>;
export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>;
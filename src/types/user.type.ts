import type { Doctor } from "./doctor.type";
import type { Patient } from "./patient.type";
import type { Receptionist } from "./receptionist.type";
import type { Role } from "./index";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  patient: Patient | null;
  doctor: Doctor | null;
  receptionist: Receptionist | null;
}

export type UserBasic = Omit<User, 'isVerified' | 'isActive' | 'patient' | 'doctor' | 'receptionist' | 'createdAt' | 'updatedAt'>;

export interface UpdateUserModel {
  name: string;
}
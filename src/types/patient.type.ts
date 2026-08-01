import type { UserBasic } from "./user.type";

export type BloodType = 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE' | 'UNKNOWN';

export interface Patient {
  id: string;
  userId: string;
  dateOfBirth: string;
  bloodType: BloodType;
  allergies: string;
  user: UserBasic;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  insuranceProvider: string | null;
  insurancePolicyNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PatientPayload {
  dateOfBirth: string;
  bloodType: BloodType;
  allergies: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
}
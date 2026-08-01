import type { Doctor } from "./doctor.type";
import type { Patient } from "./patient.type";

export interface Prescription {
  id: string;
  medicalRecordId: string;
  patientId: string;
  doctorId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string | null;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  patient: Patient;
  doctor: Doctor;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionPayload {
  medicalRecordId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string | null;
  startDate: string;
  endDate?: string | null;
}
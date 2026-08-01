import type { Appointment } from "./appointment.type";
import type { Doctor } from "./doctor.type";
import type { Patient } from "./patient.type";

export interface MedicalRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  visitDate: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  notes: string | null;
  followUpDate: string | null;
  createdAt: string;
  updatedAt: string;
  patient: Patient;
  doctor: Doctor;
  appointment: Appointment;
}

export interface MedicalRecordPayload {
  appointmentId: string;
  visitDate: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  notes?: string | null;
  followUpDate?: string | null;
}

export type UpdateMedicalRecordPayload = Partial<Omit<MedicalRecordPayload, 'appointmentId'>>;
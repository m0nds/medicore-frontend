import type { Doctor } from "./doctor.type";
import type { Patient } from "./patient.type";

export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  duration: number;
  status: AppointmentStatus;
  reason: string;
  notes: string | null;
  cancelledAt: string | null;
  cancelledBy: string | null;
  cancellationReason: string | null;
  patient: Patient;
  doctor: Doctor;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentPayload {
  doctorId: string;
  scheduledAt: string;
  duration?: number;
  reason: string;
  notes?: string;
}

export type AppointmentStatusPayload = Pick<Appointment, 'status'>;

export type CancelAppointmentPayload = Pick<Appointment, 'cancellationReason'>;
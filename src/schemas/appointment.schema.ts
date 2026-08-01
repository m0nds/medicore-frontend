import type { AppointmentStatus } from "@/types/appointment.type";
import z from "zod";

export const bookAppointmentSchema = z.object({
  doctorId: z.string({ error: "Invalid doctor ID" }),
  appointmentDate: z.string({ error: "Date is required" }),
  duration: z.number().min(1, { error: "Duration must be at least 1" }).optional(),
  scheduledAt: z.string({ error: "Schedule is required" }),
  reason: z.string({ error: "Reason is required" }),
  notes: z.string().optional(),
}).strict();

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'] as AppointmentStatus[])
}).strict();

export const cancelAppointmentSchema = z.object({
  cancellationReason: z.string({ error: "Reason for cancellation is required" }),
}).strict();

export type BookAppointmentBody = z.infer<typeof bookAppointmentSchema>;
export type UpdateAppointmentStatusBody = z.infer<typeof updateAppointmentStatusSchema>;
export type CancelAppointmentBody = z.infer<typeof cancelAppointmentSchema>;
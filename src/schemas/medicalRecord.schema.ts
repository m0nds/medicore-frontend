import z from "zod";

export const createMedicalRecordSchema = z.object({
  appointmentId: z.string({ error: "Appointment ID is required" }),
  symptoms: z.string({ error: "Symptoms are required" }),
  visitDate: z.string({ error: "Visit date is required" }),
  diagnosis: z.string({ error: "Diagnosis is required" }),
  treatment: z.string({ error: "Treatment is required" }),
  notes: z.string().optional(),
  followUpDate: z.string().optional(),
}).strict();

export const updateMedicalRecordSchema = z.object({
  symptoms: z.string().optional(),
  visitDate: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
  followUpDate: z.string().optional(),
}).strict();

export type CreateMedicalRecordBody = z.infer<typeof createMedicalRecordSchema>;
export type UpdateMedicalRecordBody = z.infer<typeof updateMedicalRecordSchema>;
import z from "zod";

export const createPrescriptionSchema = z.object({
  medicalRecordId: z.string({ error: "Medical record is required" }),
  medicineName: z.string({ error: "Medicine name is required" }),
  dosage: z.string({ error: "Dosage is required" }),
  frequency: z.string({ error: "Frequency is required" }),
  duration: z.string({ error: "Duration is required" }),
  instructions: z.string({ error: "Instructions is required" }),
}).strict();

export type CreatePrescriptionBody = z.infer<typeof createPrescriptionSchema>;
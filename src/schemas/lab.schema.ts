import type { LabUrgency } from "@/types/lab.type";
import z from "zod";

export const createLabOrderSchema = z.object({
  medicalRecordId: z.string({ error: "Medical record is required" }),
  testName: z.string({ error: "Test name is required" }),
  urgency: z.enum(["ROUTINE", "URGENT", "STAT"] as LabUrgency[]).optional(),
  instructions: z.string().optional(),
}).strict();

export const updateLabResultSchema = z.object({
  resultData: z.string({ error: "Result data is required" }),
  normalRange: z.string().optional(),
  interpretation: z.string({ error: "Interpretation is required" }),
  performedAt: z.string({ error: "Performed at is required" }),
  performedBy: z.string().optional(),
}).strict();

export type CreateLabOrderBody = z.infer<typeof createLabOrderSchema>;
export type UpdateLabResultBody = z.infer<typeof updateLabResultSchema>;
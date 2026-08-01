import z from "zod";
import type { BloodType } from "@/types/patient.type";

export const updatePatientSchema = z.object({
  name: z.string({ error: "Name is required" }).min(3, { error: "Name must be at least 3 characters long" }),
  email: z.string({ error: "Email is required" }).email({ error: "Invalid email" }),
  dateOfBirth: z.string({ error: "Date of birth is required" }),
  bloodType: z.enum(["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE", "UNKNOWN"] as BloodType[], { error: "Blood type is required" }),
  allergies: z.string({ error: "Allergies is required" }),
  emergencyContactName: z.string({ error: "Emergency contact name is required" }),
  emergencyContactPhone: z.string({ error: "Emergency contact phone is required" }),
  insuranceProvider: z.string({ error: "Insurance provider is required" }),
  insurancePolicyNumber: z.string({ error: "Insurance policy number is required" }),
}).strict();

export type UpdatePatientBody = z.infer<typeof updatePatientSchema>;
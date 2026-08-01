import z from "zod";

export const updateDoctorProfileSchema = z.object({
  bio: z.string({ error: "Bio is required" }),
  yearsOfExperience: z.number({ error: "Years of experience is required" }),
  licenseNumber: z.string({ error: "License number is required" }),
}).strict();

export const toggleAvailabilitySchema = z.object({
  isAvailable: z.boolean({ error: "Availability is required" }),
}).strict();

export type UpdateDoctorProfileBody = z.infer<typeof updateDoctorProfileSchema>;
export type ToggleAvailabilityBody = z.infer<typeof toggleAvailabilitySchema>;
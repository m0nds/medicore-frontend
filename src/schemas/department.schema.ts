import z from "zod";

export const createDepartmentSchema = z.object({
  name: z.string({ error: "Name is required" }),
  description: z.string().optional(),
  headDoctorId: z.string().optional(),
}).strict();

export const updateDepartmentSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  headDoctorId: z.string().optional(),
}).strict();

export type CreateDepartmentBody = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentBody = z.infer<typeof updateDepartmentSchema>;
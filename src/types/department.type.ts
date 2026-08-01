import type { Doctor } from "./doctor.type";

export interface Department {
  id: string;
  name: string;
  description: string | null;
  headDoctorId: string | null;
  headDoctor: Doctor;
  doctors: Doctor[];
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentPayload {
  name: string;
  description?: string;
  headDoctorId?: string;
}

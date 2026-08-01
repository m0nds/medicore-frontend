// import type { Appointment } from "./appointment.type";
import type { FetchParams } from ".";
import type { Department } from "./department.type";
import type { Specialisation } from "./specialisation.type";
import type { UserBasic } from "./user.type";

export interface FetchDoctorParams extends FetchParams {
  status?: string;
}

export interface Doctor {
  id: string;
  userId: string;
  licenseNumber: string;
  departmentId: string | null;
  bio: string | null;
  yearsOfExperience: number;
  isAvailable: boolean;
  user: UserBasic;
  department: Department | null;
  // headOfDepartment: Department;
  specialisations: DoctorSpecialisation[];
  // appointments: Appointment[];
  // medicalRecords: {};
  // labOrders: {};
  // prescriptions: {};
  createdAt: string;
  updatedAt: string;
}

export interface DoctorSpecialisation {
  doctorId: string;
  specialisationId: string;
  assignedAt: string;
  specialisation: Specialisation;
}

export interface DoctorPayload {
  bio: string;
  yearsOfExperience: number;
  licenseNumber: string;
}

export interface DoctorAvailabilityPayload {
  isAvailable: boolean;
}

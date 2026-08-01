import type { ApiResponse, ApiPaginatedResponse, FetchParams } from "@/types";
import type { Patient, PatientPayload } from "@/types/patient.type";
import service from "./service";
import type { QueryFunctionContext } from "@tanstack/react-query";

export const patientService = {
  fetchPatients: async ({ queryKey, signal }: QueryFunctionContext<['patients', FetchParams]>): Promise<ApiPaginatedResponse<Patient>> => {
    const [, params] = queryKey;
    const response = await service.get(`/patients`, { params, signal });
    return response.data;
  },
  fetchPatient: async ({ signal }: QueryFunctionContext<['patient', 'profile']>): Promise<ApiResponse<Patient>> => {
    const response = await service.get(`/patients/me`, { signal });
    return response.data;
  },
  fetchPatientById: async ({ queryKey, signal }: QueryFunctionContext<['patient', string]>): Promise<ApiResponse<Patient>> => {
    const [, id] = queryKey;
    const response = await service.get(`/patients/${id}`, { signal });
    return response.data;
  },
  updatePatientProfile: async (data: PatientPayload): Promise<ApiResponse<Patient>> => {
    const response = await service.patch(`/patients/me`, data);
    return response.data;
  }
}
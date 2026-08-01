import type { FetchDoctorParams, DoctorAvailabilityPayload, DoctorPayload } from "@/types/doctor.type";
import type { QueryFunctionContext } from "@tanstack/react-query";
import service from "./service";
import type { ApiPaginatedResponse, ApiResponse } from "@/types";
import type { Doctor } from "@/types/doctor.type";

export const doctorService = {
  fetchDoctors: async ({ queryKey, signal }: QueryFunctionContext<['doctors', FetchDoctorParams]>): Promise<ApiPaginatedResponse<Doctor>> => {
    const [, params] = queryKey;
    const response = await service.get<ApiPaginatedResponse<Doctor>>(`/doctors`, { params, signal });
    return response.data
  },
  fetchDoctor: async ({ signal }: QueryFunctionContext<['doctor', 'profile']>): Promise<ApiResponse<Doctor>> => {
    const response = await service.get<ApiResponse<Doctor>>(`/doctors/me`, { signal });
    return response.data
  },
  fetchDoctorById: async ({ queryKey, signal }: QueryFunctionContext<['doctor', string]>): Promise<ApiResponse<Doctor>> => {
    const [, id] = queryKey;
    const response = await service.get<ApiResponse<Doctor>>(`/doctors/${id}`, { signal });
    return response.data
  },
  updateDoctorProfile: async (data: DoctorPayload): Promise<ApiResponse<Doctor>> => {
    const response = await service.patch(`/doctors/me`, data);
    return response.data;
  },
  toggleDoctorAvailability: async (data: DoctorAvailabilityPayload): Promise<ApiResponse<Doctor>> => {
    const response = await service.patch(`/doctors/me/availability`, data);
    return response.data;
  }
}
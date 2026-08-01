import type { ApiResponse, ApiPaginatedResponse, FetchParams } from "@/types";
import type { MedicalRecord, MedicalRecordPayload, UpdateMedicalRecordPayload } from "@/types/medicalRecord.type";
import service from "./service";
import type { QueryFunctionContext } from "@tanstack/react-query";

export const medicalRecordService = {
  fetchMedicalRecords: async ({ queryKey, signal }: QueryFunctionContext<['medicalRecords', FetchParams]>): Promise<ApiPaginatedResponse<MedicalRecord>> => {
    const [, params] = queryKey;
    const response = await service.get<ApiPaginatedResponse<MedicalRecord>>(`/medical-records`, { params, signal });
    return response.data;
  },
  fetchMedicalRecord: async ({ queryKey, signal }: QueryFunctionContext<['medicalRecord', string]>): Promise<ApiResponse<MedicalRecord>> => {
    const [, id] = queryKey;
    const response = await service.get<ApiResponse<MedicalRecord>>(`/medical-records/${id}`, { signal });
    return response.data;
  },
  createMedicalRecord: async (data: MedicalRecordPayload): Promise<ApiResponse<MedicalRecord>> => {
    const response = await service.post<ApiResponse<MedicalRecord>>(`/medical-records`, data);
    return response.data;
  },
  updateMedicalRecord: async ({ id, data }: { id: string, data: UpdateMedicalRecordPayload }): Promise<ApiResponse<MedicalRecord>> => {
    const response = await service.patch<ApiResponse<MedicalRecord>>(`/medical-records/${id}`, data);
    return response.data;
  }
}
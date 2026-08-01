import type { ApiResponse } from "@/types";
import type { Prescription, PrescriptionPayload } from "@/types/prescription.type";
import service from "./service";
import type { QueryFunctionContext } from "@tanstack/react-query";
import type { FetchParams } from "@/types";

export const prescriptionService = {
  fetchPrescriptions: async ({ queryKey, signal }: QueryFunctionContext<['prescriptions', FetchParams]>) => {
    const [, params] = queryKey;
    const response = await service.get<ApiResponse<Prescription[]>>(`/prescriptions`, { params, signal });
    return response.data;
  },
  fetchPrescription: async ({ queryKey, signal }: QueryFunctionContext<['prescription', string]>) => {
    const [, id] = queryKey;
    const response = await service.get<ApiResponse<Prescription>>(`/prescriptions/${id}`, { signal });
    return response.data;
  },
  createPrescription: async (data: PrescriptionPayload) => {
    const response = await service.post<ApiResponse<Prescription>>(`/prescriptions`, data);
    return response.data;
  },
  deactivatePrescription: async (id: string) => {
    const response = await service.patch<ApiResponse<Prescription>>(`/prescriptions/${id}`);
    return response.data;
  }
}
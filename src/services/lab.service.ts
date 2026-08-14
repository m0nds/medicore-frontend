import type { ApiPaginatedResponse, ApiResponse } from "@/types";
import type { LabOrder, LabOrderPayload, LabResult, LabResultPayload } from "@/types/lab.type";
import service from "./service";
import type { QueryFunctionContext } from "@tanstack/react-query";
import type { FetchParams } from "@/types";

export const labService = {
  fetchLabOrders: async ({ queryKey, signal }: QueryFunctionContext<['labOrders', FetchParams]>) => {
    const [, params] = queryKey;
    const response = await service.get<ApiPaginatedResponse<LabOrder>>(`/lab-orders`, { params, signal });
    return response.data;
  },
  fetchLabOrder: async ({ queryKey, signal }: QueryFunctionContext<['labOrder', string]>) => {
    const [, id] = queryKey;
    const response = await service.get<ApiResponse<LabOrder>>(`/lab-orders/${id}`, { signal });
    return response.data;
  },
  createLabOrder: async (data: LabOrderPayload) => {
    const response = await service.post<ApiResponse<LabOrder>>(`/lab-orders`, data);
    return response.data;
  },
  updateLabResult: async (id: string, data: LabResultPayload) => {
    const response = await service.patch<ApiResponse<LabResult>>(`/lab-orders/${id}/result`, data);
    return response.data;
  },
  fetchLabResult: async ({ queryKey, signal }: QueryFunctionContext<['labResult', string]>) => {
    const [, id] = queryKey;
    const response = await service.get<ApiResponse<LabResult>>(`/lab-results/${id}`, { signal });
    return response.data;
  },
}
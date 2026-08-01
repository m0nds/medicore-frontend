import type { FetchParams, ApiPaginatedResponse, ApiResponse } from "@/types";
import service from "./service";
import type { QueryFunctionContext } from "@tanstack/react-query";
import type { DepartmentPayload, Department } from "@/types/department.type";

export const departmentService = {
  fetchDepartments: async ({ queryKey, signal }: QueryFunctionContext<['departments', FetchParams]>) => {
    const [, params] = queryKey;
    const response = await service.get<ApiPaginatedResponse<Department>>(`/departments`, { params, signal });
    return response.data;
  },
  fetchDepartmentById: async ({ queryKey, signal }: QueryFunctionContext<['department', string]>) => {
    const [, id] = queryKey;
    const response = await service.get<ApiResponse<Department>>(`/departments/${id}`, { signal });
    return response.data;
  },
  createDepartment: async (data: DepartmentPayload) => {
    const response = await service.post<ApiResponse<Department>>(`/departments`, data);
    return response.data;
  },
  updateDepartment: async (id: string, data: DepartmentPayload) => {
    const response = await service.patch<ApiResponse<Department>>(`/departments/${id}`, data);
    return response.data;
  },
  deleteDepartment: async (id: string) => {
    const response = await service.delete<ApiResponse<void>>(`/departments/${id}`);
    return response.data;
  }
}
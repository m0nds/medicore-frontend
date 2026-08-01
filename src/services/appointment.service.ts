import type { ApiPaginatedResponse, ApiResponse, FetchParams } from "@/types";
import type { Appointment, AppointmentPayload, CancelAppointmentPayload, AppointmentStatusPayload } from "@/types/appointment.type";
import service from "./service";
import type { QueryFunctionContext } from "@tanstack/react-query";

export const appointmentService = {
  fetchAppointments: async ({ queryKey, signal }: QueryFunctionContext<['appointments', FetchParams]>): Promise<ApiPaginatedResponse<Appointment>> => {
    const [, params] = queryKey;
    const response = await service.get<ApiPaginatedResponse<Appointment>>(`/appointments`, { params, signal });
    return response.data;
  },
  fetchAppointmentById: async ({ queryKey, signal }: QueryFunctionContext<['appointment', string]>): Promise<ApiResponse<Appointment>> => {
    const [, id] = queryKey;
    const response = await service.get<ApiResponse<Appointment>>(`/appointments/${id}`, { signal });
    return response.data;
  },
  bookAppointment: async (data: AppointmentPayload): Promise<ApiResponse<Appointment>> => {
    const response = await service.post<ApiResponse<Appointment>>(`/appointments`, data);
    return response.data;
  },
  updateAppointmentStatus: async ({ id, data }: { id: string, data: AppointmentStatusPayload }): Promise<ApiResponse<Appointment>> => {
    const response = await service.patch<ApiResponse<Appointment>>(`/appointments/${id}/status`, data);
    return response.data;
  },
  cancelAppointment: async ({ id, data }: { id: string, data: CancelAppointmentPayload }): Promise<ApiResponse<Appointment>> => {
    const response = await service.patch<ApiResponse<Appointment>>(`/appointments/${id}/cancel`, data);
    return response.data;
  },
}
export interface ErrorResponse {
  success: boolean;
  error: string;
  code: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiPaginatedResponse<T> {
  success: boolean;
  // message: string;
  data: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number
  total: number;
  totalPages: number;
}

export type Role = 'PATIENT' | 'DOCTOR' | 'RECEPTIONIST' | 'ADMIN';


export interface FetchParams {
  page: number;
  limit: number;
}
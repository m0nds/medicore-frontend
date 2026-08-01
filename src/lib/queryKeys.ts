import type { FetchParams } from '@/types'
import type { FetchDoctorParams } from '@/types/doctor.type'

/**
 * Query-key factories, one const per module.
 *
 * Each module exposes:
 *  - `lists` / `details` — broad "whole shelf" keys for invalidateQueries
 *    (prefix-match every list / every detail at once).
 *  - `list(params)` / `detail(id)` — the exact key one query reads from.
 *
 * Keys mirror the tuples the services are typed against (note the plural-list /
 * singular-detail split, e.g. ['appointments', params] vs ['appointment', id]).
 * Edit freely — the hooks import their keys from here.
 */

export const appointmentKeys = {
  lists: ['appointments'] as const,
  list: (params: FetchParams): ['appointments', FetchParams] => ['appointments', params],
  details: ['appointment'] as const,
  detail: (id: string): ['appointment', string] => ['appointment', id],
}

export const departmentKeys = {
  lists: ['departments'] as const,
  list: (params: FetchParams): ['departments', FetchParams] => ['departments', params],
  details: ['department'] as const,
  detail: (id: string): ['department', string] => ['department', id],
}

export const doctorKeys = {
  lists: ['doctors'] as const,
  list: (params: FetchDoctorParams): ['doctors', FetchDoctorParams] => ['doctors', params],
  details: ['doctor'] as const,
  detail: (id: string): ['doctor', string] => ['doctor', id],
  me: (): ['doctor', 'profile'] => ['doctor', 'profile'],
}

export const labKeys = {
  orders: ['labOrders'] as const,
  orderList: (params: FetchParams): ['labOrders', FetchParams] => ['labOrders', params],
  order: (id: string): ['labOrder', string] => ['labOrder', id],
  result: (id: string): ['labResult', string] => ['labResult', id],
}

export const medicalRecordKeys = {
  lists: ['medicalRecords'] as const,
  list: (params: FetchParams): ['medicalRecords', FetchParams] => ['medicalRecords', params],
  details: ['medicalRecord'] as const,
  detail: (id: string): ['medicalRecord', string] => ['medicalRecord', id],
}

export const patientKeys = {
  lists: ['patients'] as const,
  list: (params: FetchParams): ['patients', FetchParams] => ['patients', params],
  details: ['patient'] as const,
  detail: (id: string): ['patient', string] => ['patient', id],
  me: (): ['patient', 'profile'] => ['patient', 'profile'],
}

export const prescriptionKeys = {
  lists: ['prescriptions'] as const,
  list: (params: FetchParams): ['prescriptions', FetchParams] => ['prescriptions', params],
  details: ['prescription'] as const,
  detail: (id: string): ['prescription', string] => ['prescription', id],
}

export const userKeys = {
  me: (): ['user', 'me'] => ['user', 'me'],
}

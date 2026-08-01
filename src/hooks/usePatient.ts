import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { FetchParams } from '@/types'
import { patientService } from '@/services/patient.service'
import { patientKeys } from '@/lib/queryKeys'

export function usePatients(params: FetchParams) {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: patientService.fetchPatients,
  })
}

/** The signed-in patient's own profile (`/patients/me`). */
export function usePatientProfile() {
  return useQuery({
    queryKey: patientKeys.me(),
    queryFn: patientService.fetchPatient,
  })
}

export function usePatient(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: patientService.fetchPatientById,
    enabled: !!id && (options?.enabled ?? true),
  })
}

export function useUpdatePatientProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: patientService.updatePatientProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.me() })
    },
  })
}

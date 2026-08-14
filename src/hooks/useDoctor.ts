import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { FetchDoctorParams } from '@/types/doctor.type'
import { doctorService } from '@/services/doctor.service'
import { doctorKeys } from '@/lib/queryKeys'
import type { AxiosError } from 'axios'
import type { ErrorResponse } from '@/types'
import { toast } from 'sonner'

export function useDoctors(params: FetchDoctorParams) {
  return useQuery({
    queryKey: doctorKeys.list(params),
    queryFn: doctorService.fetchDoctors,
  })
}

/** The signed-in doctor's own profile (`/doctors/me`). */
export function useDoctorProfile() {
  return useQuery({
    queryKey: doctorKeys.me(),
    queryFn: doctorService.fetchDoctor,
  })
}

export function useDoctor(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: doctorService.fetchDoctorById,
    enabled: !!id && (options?.enabled ?? true),
  })
}

export function useUpdateDoctorProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: doctorService.updateDoctorProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.me() })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error ?? 'Could not update the doctor profile. Please try again.')
    }
  })
}

export function useToggleDoctorAvailability() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: doctorService.toggleDoctorAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.me() })
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error ?? 'Could not update availability. Please try again.')
    }
  })
}

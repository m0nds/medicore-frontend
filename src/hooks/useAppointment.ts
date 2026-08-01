import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { FetchParams } from '@/types'
import { appointmentService } from '@/services/appointment.service'
import { appointmentKeys } from '@/lib/queryKeys'

export function useAppointments(params: FetchParams) {
  return useQuery({
    queryKey: appointmentKeys.list(params),
    queryFn: appointmentService.fetchAppointments,
  })
}

export function useAppointment(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: appointmentService.fetchAppointmentById,
    enabled: !!id && (options?.enabled ?? true),
  })
}

export function useBookAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: appointmentService.bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists })
    },
  })
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: appointmentService.updateAppointmentStatus,
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists })
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(id) })
    },
  })
}

export function useCancelAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: appointmentService.cancelAppointment,
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists })
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(id) })
    },
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ErrorResponse, FetchParams } from '@/types'
import { prescriptionService } from '@/services/prescription.service'
import { prescriptionKeys } from '@/lib/queryKeys'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

export function usePrescriptions(params: FetchParams) {
  return useQuery({
    queryKey: prescriptionKeys.list(params),
    queryFn: prescriptionService.fetchPrescriptions,
  })
}

export function usePrescription(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: prescriptionKeys.detail(id),
    queryFn: prescriptionService.fetchPrescription,
    enabled: !!id && (options?.enabled ?? true),
  })
}

export function useCreatePrescription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: prescriptionService.createPrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error ?? 'Could not create the prescription. Please try again.')
    }
  })
}

export function useDeactivatePrescription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => prescriptionService.deactivatePrescription(id),
    onSuccess: (_res, id) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists })
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.detail(id) })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error ?? 'Could not deactivate the prescription. Please try again.')
    }
  })
}

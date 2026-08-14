import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ErrorResponse, FetchParams } from '@/types'
import type { LabResultPayload } from '@/types/lab.type'
import { labService } from '@/services/lab.service'
import { labKeys } from '@/lib/queryKeys'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

export function useLabOrders(params: FetchParams) {
  return useQuery({
    queryKey: labKeys.orderList(params),
    queryFn: labService.fetchLabOrders,
  })
}

export function useLabOrder(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: labKeys.order(id),
    queryFn: labService.fetchLabOrder,
    enabled: !!id && (options?.enabled ?? true),
  })
}

export function useLabResult(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: labKeys.result(id),
    queryFn: labService.fetchLabResult,
    enabled: !!id && (options?.enabled ?? true),
  })
}

export function useCreateLabOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: labService.createLabOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: labKeys.orders })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error ?? 'Could not crete the lab order. Please try again.')
    }
  })
}

export function useUpdateLabResult() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LabResultPayload }) =>
      labService.updateLabResult(id, data),
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: labKeys.orders })
      queryClient.invalidateQueries({ queryKey: labKeys.order(id) })
      queryClient.invalidateQueries({ queryKey: labKeys.result(id) })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error ?? 'Could not update the lab result. Please try again.')
    }
  })
}

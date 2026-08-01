import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { FetchParams } from '@/types'
import type { LabResultPayload } from '@/types/lab.type'
import { labService } from '@/services/lab.service'
import { labKeys } from '@/lib/queryKeys'

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
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { FetchParams } from '@/types'
import { medicalRecordService } from '@/services/medicalRecord.service'
import { medicalRecordKeys } from '@/lib/queryKeys'

export function useMedicalRecords(params: FetchParams) {
  return useQuery({
    queryKey: medicalRecordKeys.list(params),
    queryFn: medicalRecordService.fetchMedicalRecords,
  })
}

export function useMedicalRecord(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: medicalRecordKeys.detail(id),
    queryFn: medicalRecordService.fetchMedicalRecord,
    enabled: !!id && (options?.enabled ?? true),
  })
}

export function useCreateMedicalRecord() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: medicalRecordService.createMedicalRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.lists })
    },
  })
}

export function useUpdateMedicalRecord() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: medicalRecordService.updateMedicalRecord,
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.lists })
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.detail(id) })
    },
  })
}

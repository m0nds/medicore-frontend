import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ErrorResponse, FetchParams } from '@/types'
import type { DepartmentPayload } from '@/types/department.type'
import { departmentService } from '@/services/department.service'
import { departmentKeys } from '@/lib/queryKeys'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

export function useDepartments(params: FetchParams) {
  return useQuery({
    queryKey: departmentKeys.list(params),
    queryFn: departmentService.fetchDepartments,
  })
}

export function useDepartment(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: departmentService.fetchDepartmentById,
    enabled: !!id && (options?.enabled ?? true),
  })
}

export function useCreateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: departmentService.createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error ?? 'Could not create the department. Please try again.')
    }
  })
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    // Service takes positional args, so adapt to a single mutation variable.
    mutationFn: ({ id, data }: { id: string; data: DepartmentPayload }) =>
      departmentService.updateDepartment(id, data),
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists })
      queryClient.invalidateQueries({ queryKey: departmentKeys.detail(id) })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error ?? 'Could not update the department. Please try again.')
    }
  })
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => departmentService.deleteDepartment(id),
    onSuccess: (_res, id) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists })
      queryClient.invalidateQueries({ queryKey: departmentKeys.detail(id) })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error ?? 'Could not delete the department. Please try again.')
    }
  })
}
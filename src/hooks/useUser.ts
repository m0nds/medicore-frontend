import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/user.service'
import { userKeys } from '@/lib/queryKeys'
import type { AxiosError } from 'axios'
import type { ErrorResponse } from '@/types'
import { toast } from 'sonner'

export function useUser() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: userService.getUser,
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userService.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error ?? 'Could not update the user. Please try again.')
    }
  })
}

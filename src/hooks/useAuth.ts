import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import type { User } from '@/types/user.type'
import type { ErrorResponse } from '@/types'
import { toast } from 'sonner'
import type { LoginPayload, LoginResponse } from '@/types/auth.type'

/**
 * Log in and persist the session. Navigation stays in the caller (it needs the
 * route + redirect param) — this hook only owns the reusable side effect of
 * writing auth into the store.
 */
export function useLogin() {
  return useMutation<LoginResponse, AxiosError<ErrorResponse>, LoginPayload>({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const payload = data?.data;
      // LoginResponse omits the relation objects; default them to null (hydrated
      // later by useUser / a fetch-me call).
      const user: User = { ...payload.user, patient: null, doctor: null, receptionist: null }
      useAuthStore.getState().setAuth(user, payload.accessToken)
    },
    onError: (error: AxiosError<ErrorResponse>) => { 
      toast.error(error.response?.data?.error ?? 'Invalid email or password')
    }
  })
}

export function useRegister() {
  return useMutation({ 
    mutationFn: authService.register,
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error ?? 'Could not register. Please try again.')
    }
  })
}

export function useVerifyEmail() {
  return useMutation({ 
    mutationFn: authService.verifyEmail,
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error ?? 'Could not verify email. Please try again.')
    }
  })
}

export function useForgotPassword() {
  return useMutation({ 
    mutationFn: authService.forgotPassword,
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error ?? 'Could not find email. Please try again.')
    }
  })
}

export function useResetPassword() {
  return useMutation({ 
    mutationFn: authService.resetPassword,
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error ?? 'Could not find email. Please try again.')
    }
  })
}

export function useLogout() {
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      useAuthStore.getState().resetState();
      toast.success('You have successfully logged out');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      useAuthStore.getState().resetState();
      toast.error(error.response?.data?.error ?? 'An error occurred')
    }
  })
}

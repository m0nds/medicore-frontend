import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import type { User } from '@/types/user.type'

/**
 * Log in and persist the session. Navigation stays in the caller (it needs the
 * route + redirect param) — this hook only owns the reusable side effect of
 * writing auth into the store.
 */
export function useLogin() {
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (res) => {
      // LoginResponse omits the relation objects; default them to null (hydrated
      // later by useUser / a fetch-me call).
      const user: User = { ...res.user, patient: null, doctor: null, receptionist: null }
      useAuthStore.getState().setAuth(user, res.accessToken)
    },
  })
}

export function useRegister() {
  return useMutation({ mutationFn: authService.register })
}

export function useVerifyEmail() {
  return useMutation({ mutationFn: authService.verifyEmail })
}

export function useForgotPassword() {
  return useMutation({ mutationFn: authService.forgotPassword })
}

export function useResetPassword() {
  return useMutation({ mutationFn: authService.resetPassword })
}

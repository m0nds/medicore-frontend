import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth.store'
import { roleHomePath } from '@/lib/portal'

// Pathless layout for public auth pages (login, register, …). Its children sit
// at the root (`/login`, not `/_auth/login`).
export const Route = createFileRoute('/_auth')({
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState()
    // Already signed in → skip auth pages, go to the role's home.
    if (isAuthenticated && user) {
      throw redirect({ to: roleHomePath(user.role) })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Outlet />
    </div>
  )
}

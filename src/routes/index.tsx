import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth.store'
import { roleHomePath } from '@/lib/portal'

// Apex / localhost root. (On a portal subdomain `/` is rewritten to `/{portal}`
// before this ever matches, so this only runs on the bare domain.)
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState()
    if (isAuthenticated && user) {
      throw redirect({ to: roleHomePath(user.role) })
    }
    throw redirect({ to: '/login' })
  },
})

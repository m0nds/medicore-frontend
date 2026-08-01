import { redirect } from '@tanstack/react-router'
import type { Role } from '@/types'
import { useAuthStore } from '@/stores/auth.store'
import { crossPortalTarget } from './portal'

/**
 * Ensure the signed-in user's role matches the portal they're entering.
 * On mismatch:
 *  - dev / path-prefix mode: throw an in-app redirect to the user's own portal.
 *  - production / subdomain mode: hard-navigate to their portal's subdomain
 *    (a different origin, so client routing can't reach it).
 *
 * Assumes `_authenticated` already guaranteed the user is signed in.
 */
export function requireRole(expected: Role): void {
  const { user } = useAuthStore.getState()
  if (!user || user.role === expected) return

  const target = crossPortalTarget(user.role)
  if (target.href) {
    window.location.assign(target.href)
    return
  }
  throw redirect({ to: target.to })
}

import { createRouter } from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'
import { queryClient } from './queryClient'
import { DefaultCatchBoundary } from '@/components/DefaultCatchBoundary'
import { DefaultNotFound } from '@/components/DefaultNotFound'
import { createPortalRewrite, getCurrentPortal } from './portal'

// On a portal subdomain (patient/doctor/receptionist/admin) we rewrite the
// location so the `/{portal}` prefix is hidden from the address bar. On apex /
// localhost there's no portal, so routes render with the raw `/{portal}/...`
// path prefix (local dev mode).
const portal = getCurrentPortal()

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: DefaultCatchBoundary,
  defaultNotFoundComponent: DefaultNotFound,
  scrollRestoration: true,
  defaultStructuralSharing: true,
  ...(portal ? { rewrite: createPortalRewrite(portal) } : {}),
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

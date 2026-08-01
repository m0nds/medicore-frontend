import type { QueryClient } from '@tanstack/react-query'

/**
 * Typed router context (dependency injection for loaders/guards).
 * Kept in its own module so `__root.tsx` and `router.tsx` can both import it
 * without a cycle through the generated route tree.
 *
 * Note: auth is intentionally NOT stored here — it would be a stale snapshot
 * taken at router creation. Guards read `useAuthStore.getState()` directly so
 * they always see current auth.
 */
export interface RouterContext {
  queryClient: QueryClient
}

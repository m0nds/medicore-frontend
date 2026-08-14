import { QueryClient } from '@tanstack/react-query'

// Single shared client used by both the QueryClientProvider and the router
// context (so loaders and components read/write the same cache).
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2,
      retry: false,
    },
  },
})

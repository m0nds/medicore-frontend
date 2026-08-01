import { LoginPage } from '@/pages/auth/login-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/login')({
  // `redirect` carries the originally-requested URL so we can return there after
  // a successful login (set by the _authenticated guard).
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: LoginPage,
})
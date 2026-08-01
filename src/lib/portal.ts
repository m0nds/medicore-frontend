import type { LocationRewrite } from '@tanstack/react-router'
import type { Role } from '@/types'

/**
 * Portal = the subdomain segment that scopes a user role.
 * In the route tree these are real path segments (`/patient/...`, `/admin/...`);
 * in production the LocationRewrite below hides them behind the subdomain so the
 * address bar reads e.g. `patient.medicore.app/dashboard`.
 */
export type PortalSegment = 'patient' | 'doctor' | 'receptionist' | 'admin'

export const ROLE_TO_PORTAL: Record<Role, PortalSegment> = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  RECEPTIONIST: 'receptionist',
  ADMIN: 'admin',
}

const PORTAL_TO_ROLE: Record<PortalSegment, Role> = {
  patient: 'PATIENT',
  doctor: 'DOCTOR',
  receptionist: 'RECEPTIONIST',
  admin: 'ADMIN',
}

export type RoleHomePath =
  | '/patient/dashboard'
  | '/doctor/dashboard'
  | '/receptionist/dashboard'
  | '/admin/dashboard'

/**
 * Root path a given role should land on. This is the INTERNAL (prefixed) path;
 * the rewrite strips the prefix for display on the matching subdomain. Typed as
 * the exact union of registered dashboard routes so `redirect({ to })` stays
 * type-safe.
 */
export const roleHomePath = (role: Role): RoleHomePath =>
  `/${ROLE_TO_PORTAL[role]}/dashboard`

export const portalToRole = (portal: PortalSegment): Role => PORTAL_TO_ROLE[portal]

/**
 * Public routes that live at the root of every portal (the `_auth` group). These
 * are NOT under a `/{portal}` prefix, so the rewrite must leave them untouched —
 * otherwise reloading `patient.medicore.app/login` would resolve to the
 * non-existent `/patient/login`.
 */
const PUBLIC_ROOT_SEGMENTS = new Set([
  'login',
  'register',
  'verify',
  'forgot-password',
  'reset-password',
])

const isPublicPath = (pathname: string): boolean =>
  PUBLIC_ROOT_SEGMENTS.has(pathname.split('/')[1] ?? '')

/**
 * The admin subdomain can be set to a non-obvious hostname in production
 * (VITE_ADMIN_SUBDOMAIN) so the delicate admin portal isn't guessable. Defaults
 * to 'admin' for local/preview convenience.
 */
const adminSubdomain = (): string =>
  (import.meta.env.VITE_ADMIN_SUBDOMAIN as string | undefined) ?? 'admin'

/**
 * Resolve the current portal from the hostname's first label.
 * Returns null on apex/localhost (dev), where we use the raw `/{portal}/...`
 * path prefix instead of subdomains.
 */
export const getCurrentPortal = (): PortalSegment | null => {
  const sub = window.location.hostname.split('.')[0]
  if (sub === adminSubdomain()) return 'admin'
  if (sub === 'patient' || sub === 'doctor' || sub === 'receptionist') return sub
  return null
}

/**
 * Build the LocationRewrite for a portal subdomain:
 *   input  (browser → router): prepend `/{portal}` to authenticated paths
 *   output (router → browser): strip `/{portal}` back off
 * Public/auth paths pass through untouched.
 */
export const createPortalRewrite = (portal: PortalSegment): LocationRewrite => {
  const prefix = `/${portal}`

  return {
    input: ({ url }) => {
      if (isPublicPath(url.pathname)) return undefined
      // Already prefixed (defensive) — leave as-is.
      if (url.pathname === prefix || url.pathname.startsWith(`${prefix}/`)) {
        return undefined
      }
      url.pathname = url.pathname === '/' ? prefix : `${prefix}${url.pathname}`
      return url
    },
    output: ({ url }) => {
      if (url.pathname === prefix) {
        url.pathname = '/'
        return url
      }
      if (url.pathname.startsWith(`${prefix}/`)) {
        url.pathname = url.pathname.slice(prefix.length)
        return url
      }
      return undefined
    },
  }
}

/**
 * When a user's role doesn't match the portal they're on:
 *  - dev / path-prefix mode (no subdomain): return an in-app path to navigate to.
 *  - production / subdomain mode: return an absolute cross-subdomain URL, since
 *    portals live on different origins and can't be reached via client routing.
 */
export const crossPortalTarget = (role: Role): { href?: string; to: string } => {
  const to = roleHomePath(role)
  const current = getCurrentPortal()
  if (!current) return { to } // dev: same-origin navigate

  const targetPortal = ROLE_TO_PORTAL[role]
  if (targetPortal === current) return { to }

  // Swap the leading hostname label for the target portal's subdomain.
  const { protocol, hostname, port } = window.location
  const labels = hostname.split('.')
  labels[0] = targetPortal === 'admin' ? adminSubdomain() : targetPortal
  const host = labels.join('.') + (port ? `:${port}` : '')
  // Strip the internal prefix — the target origin's rewrite re-adds it.
  const cleanPath = to.replace(new RegExp(`^/${targetPortal}`), '') || '/'
  return { href: `${protocol}//${host}${cleanPath}`, to }
}

import { createFileRoute, Outlet } from '@tanstack/react-router'
import { requireRole } from '@/lib/guards'
import { PortalShell } from '@/components/portal-shell'

// Admin is a delicate portal: it lives on its own (optionally non-obvious)
// subdomain via VITE_ADMIN_SUBDOMAIN, is role-gated here, and nothing in the
// other portals links to it. autoCodeSplitting keeps this component and its
// children in their own chunks, out of the patient/doctor/receptionist bundles.
export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad: () => requireRole('ADMIN'),
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <PortalShell role="ADMIN">
      <Outlet />
    </PortalShell>
  )
}

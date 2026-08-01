import { createFileRoute, Outlet } from '@tanstack/react-router'
import { requireRole } from '@/lib/guards'
import { PortalShell } from '@/components/portal-shell'

export const Route = createFileRoute('/_authenticated/receptionist')({
  beforeLoad: () => requireRole('RECEPTIONIST'),
  component: ReceptionistLayout,
})

function ReceptionistLayout() {
  return (
    <PortalShell role="RECEPTIONIST">
      <Outlet />
    </PortalShell>
  )
}

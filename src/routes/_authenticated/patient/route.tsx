import { createFileRoute, Outlet } from '@tanstack/react-router'
import { requireRole } from '@/lib/guards'
import { PortalShell } from '@/components/portal-shell'

export const Route = createFileRoute('/_authenticated/patient')({
  beforeLoad: () => requireRole('PATIENT'),
  component: PatientLayout,
})

function PatientLayout() {
  return (
    <PortalShell role="PATIENT">
      <Outlet />
    </PortalShell>
  )
}

import { createFileRoute, Outlet } from '@tanstack/react-router'
import { requireRole } from '@/lib/guards'
import { PortalShell } from '@/components/portal-shell'

export const Route = createFileRoute('/_authenticated/doctor')({
  beforeLoad: () => requireRole('DOCTOR'),
  component: DoctorLayout,
})

function DoctorLayout() {
  return (
    <PortalShell role="DOCTOR">
      <Outlet />
    </PortalShell>
  )
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/doctor/dashboard')({
  component: DoctorDashboard,
})

function DoctorDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-foreground">Doctor dashboard</h1>
    </div>
  )
}

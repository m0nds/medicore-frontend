import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/receptionist/dashboard')({
  component: ReceptionistDashboard,
})

function ReceptionistDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-foreground">Receptionist dashboard</h1>
    </div>
  )
}

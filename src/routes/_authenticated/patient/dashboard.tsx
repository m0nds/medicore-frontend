import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/patient/dashboard')({
  component: PatientDashboard,
})

function PatientDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-foreground">Patient dashboard</h1>
    </div>
  )
}

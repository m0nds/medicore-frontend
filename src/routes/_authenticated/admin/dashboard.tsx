import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/dashboard')({
  component: AdminDashboard,
})

function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-foreground">Admin dashboard</h1>
    </div>
  )
}

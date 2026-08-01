import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/receptionist/')({
  beforeLoad: () => {
    throw redirect({ to: '/receptionist/dashboard' })
  },
})

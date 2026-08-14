import Lab from '@/pages/patient/lab/lab'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/patient/lab/')({
  component: Lab,
})
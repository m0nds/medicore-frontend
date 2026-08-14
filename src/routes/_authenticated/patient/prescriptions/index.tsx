import Prescriptions from '@/pages/patient/prescriptions/prescriptions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/patient/prescriptions/')({
  component: Prescriptions,
})
import { createFileRoute } from '@tanstack/react-router'
import { AppointmentDetail } from '@/pages/patient/appointments/detail/appointment-detail'

export const Route = createFileRoute('/_authenticated/patient/appointments/$appointmentId')({
  component: AppointmentDetail,
})
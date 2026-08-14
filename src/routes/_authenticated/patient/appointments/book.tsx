import { BookAppointment } from '@/pages/patient/appointments/book/book-appointment'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/patient/appointments/book')({
  component: BookAppointment,
})

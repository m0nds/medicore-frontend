import DoctorAppointments from '@/pages/doctor/appointments/doctor-appointments'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/doctor/appointments/')({
  component: DoctorAppointments,
})

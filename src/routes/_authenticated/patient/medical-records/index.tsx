import MedicalRecords from '@/pages/patient/medical-records/medical-records'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/patient/medical-records/')({
  component: MedicalRecords,
})
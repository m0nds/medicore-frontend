import { useMedicalRecords } from "@/hooks/useMedicalRecord"

const MedicalRecords = () => {
  const { data } = useMedicalRecords({ page: 1, limit: 10 });
  return (
    <div className="w-full h-full">medical-record</div>
  )
}

export default MedicalRecords
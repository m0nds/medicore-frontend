import { usePrescriptions } from "@/hooks/usePrescription";

const Prescriptions = () => {
  const { data } = usePrescriptions({ page: 1, limit: 10 });
  
  return (
    <div className="w-full h-full">Prescriptions</div>
  )
}

export default Prescriptions
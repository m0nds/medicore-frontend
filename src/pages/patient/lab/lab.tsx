import { useLabOrders } from "@/hooks/useLab"

const Lab = () => {
  const { data } = useLabOrders({ page: 1, limit: 10 });
  
  return (
    <div>Lab</div>
  )
}

export default Lab
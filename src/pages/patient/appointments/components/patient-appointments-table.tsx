import { DataTable } from "@/components/ui/data-table";
import { useAppointments } from "@/hooks/useAppointment";
import { useState } from "react";
import { usePatientAppointmentColumns } from "./patient-appointments-columns";
import PaginationControls from "@/components/custom/pagination-controls";
import { CancelAppointmentModal } from "../modals/cancel-appointment-modal";
import type { Appointment } from "@/types/appointment.type";

const PatientsAppointmentsTable = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [toCancel, setToCancel] = useState<Appointment | null>(null);

  const columns = usePatientAppointmentColumns({ onCancel: setToCancel });

  const { data, isFetching } = useAppointments({ page, limit });

  const appointmentData = data?.data;
  const metaData = data?.pagination;
  return (
    <div className="w-full h-full">
      <DataTable
        columns={columns}
        data={appointmentData || []}
        isLoading={isFetching}
        showInternalPagination // render the controls
        pageSize={limit}
      />

      <PaginationControls
        page={page}
        size={limit}
        totalItems={metaData?.total || 0}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newSize) => {
          setLimit(newSize);
          setPage(1);
        }}
      />

      {toCancel && (
        <CancelAppointmentModal
          appointment={toCancel}
          open={!!toCancel}
          onOpenChange={(open) => {
            if (!open) setToCancel(null);
          }}
        />
      )}
    </div>
  );
};

export default PatientsAppointmentsTable;

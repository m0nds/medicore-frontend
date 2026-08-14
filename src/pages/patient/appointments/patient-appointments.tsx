import PageTitle from "@/components/custom/pageTitle";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import PatientsAppointmentsTable from "./components/patient-appointments-table";

const AppointmentsPage = () => {
  return (
    <div>
      <PageTitle 
        text={'Appointments'}
        description={'Manage your appointments with your doctors across various departments'}
        children={(
          <div>
            <Button size='sm' asChild>
              <Link to="/patient/appointments/book">
                <CalendarPlus />
                Book Appointment
              </Link>
            </Button>
          </div>
        )}
      />

      <PatientsAppointmentsTable />
    </div>
  )
}

export default AppointmentsPage
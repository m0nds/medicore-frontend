import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { dateFormatter, STATUS_VARIANT, initialsOf } from "@/lib/helper";
import { cn } from "@/lib/utils";
import type { Appointment, AppointmentStatus } from "@/types/appointment.type"
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table"
import { CalendarX2, Eye, MoreHorizontal } from "lucide-react";

type AppointmentModalActions = {
  onCancel: (appointment: Appointment) => void;
}

export const usePatientAppointmentColumns = (actions: AppointmentModalActions) => {
  const columns: ColumnDef<Appointment>[] = [
    {
      id: 'name',
      accessorFn: (row) => row.doctor?.user?.name,
      header: 'Doctor',
      cell: ({ row }) => {
        const name = row.original.doctor?.user?.name;
        const department = row.original.doctor?.department?.name;
        return (
          <div className='flex items-center gap-1'>
            <Avatar>
              <AvatarFallback className='!text-code-sm'>{initialsOf(name)}</AvatarFallback>
            </Avatar>

            <div className='flex flex-col gap-0.5'>
              <p className='text-label font-medium'>{name}</p>
              <p className='text-code-sm font-normal'>{department}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as AppointmentStatus;
        return (
          <Badge
            variant={STATUS_VARIANT[status]}
            className="pointer-events-none rounded-full capitalize gap-1.5"
          >
            <span className="size-1.5 rounded-full bg-current" />
            {status.replace('_', ' ').toLowerCase()}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Date Created',
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string;
        return <p>{dateFormatter(date)}</p>
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const appointment = row.original;

        return (
          <div className="flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-4 w-4 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-fit"
              >
                <DropdownMenuItem>
                  <Link
                    to="/patient/appointments/$appointmentId"
                    params={{ appointmentId: appointment.id }}
                    preload="intent"
                    className='flex items-center gap-2 text-code-sm'
                  >
                    <Eye />
                    View Appointment
                  </Link>
                </DropdownMenuItem>
                {['SCHEDULED', 'CONFIRMED'].includes(appointment.status) && (
                  <DropdownMenuItem
                    variant="destructive"
                    className={cn('flex items-center gap-2 !text-code-sm')}
                    onSelect={() => actions.onCancel(appointment)}
                  >
                    <CalendarX2 />
                    Cancel appointment
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return columns;
}
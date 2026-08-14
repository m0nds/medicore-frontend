import { useState, type ReactNode } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import {
  Building2,
  CalendarDays,
  CalendarX2,
  ChevronLeft,
  Clock,
  Printer,
  RefreshCw,
  Stethoscope,
  TriangleAlert,
} from 'lucide-react'
import type { AppointmentStatus } from '@/types/appointment.type'
import { useAppointment } from '@/hooks/useAppointment'
import { initialsOf, STATUS_VARIANT } from '@/lib/helper'
import { CancelAppointmentModal } from '@/pages/patient/appointments/modals/cancel-appointment-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Route } from '@/routes/_authenticated/patient/appointments/$appointmentId'
import { Badge } from '@/components/ui/badge'
import PageTitle from '@/components/custom/pageTitle'

const CANCELLABLE: AppointmentStatus[] = ['SCHEDULED', 'CONFIRMED']

// Generic, universally-safe pre-visit guidance (not condition-specific).
const PRE_VISIT = [
  'Arrive 15 minutes early for check-in',
  'Bring your insurance card and a photo ID',
  'Bring a list of your current medications and allergies',
]

const timeOf = (d: Date) =>
  new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(d)

const dateOf = (d: Date) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(d)

export function AppointmentDetail() {
  const navigate = useNavigate();
  const { appointmentId } = Route.useParams();
  const { data, isLoading, isError } = useAppointment(appointmentId)
  const [cancelOpen, setCancelOpen] = useState(false)

  const appointment = data?.data

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-52 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    )
  }

  if (isError || !appointment) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-xl border bg-card px-6 py-12 text-center">
        <div className="flex size-11 items-center justify-center rounded-full bg-[var(--status-danger-surface)]">
          <TriangleAlert className="size-5 text-[var(--status-danger)]" />
        </div>
        <div className="space-y-1">
          <h2 className="font-heading text-lg font-semibold text-foreground">Appointment not found</h2>
          <p className="text-sm text-muted-foreground">
            This appointment could not be loaded. It may have been removed or you don&apos;t have access.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate({ to: '/patient/appointments' })}>
          <ChevronLeft data-icon="inline-start" />
          Back to appointments
        </Button>
      </div>
    )
  }

  const start = new Date(appointment.scheduledAt)
  const duration = appointment.duration ?? 30
  const doctor = appointment.doctor
  const specialisation = doctor?.specialisations?.[0]?.specialisation?.name ?? doctor?.department?.name ?? 'General'
  const canCancel = CANCELLABLE.includes(appointment.status)
  // const reference = `#${appointment.id.slice(0, 8).toUpperCase()}`

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <PageTitle returnText={'Appointment Details'} />

      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="flex items-start justify-between gap-4 p-5">
          <div className="min-w-0 space-y-1.5">
            <Badge variant={STATUS_VARIANT[appointment.status]} className="ml-auto capitalize gap-1.5">
              <span className="size-1.5 rounded-full bg-current" />
              {appointment.status.replace('_', ' ').toLowerCase()}
            </Badge>
            <h1 className="font-heading text-body-lg font-bold text-foreground">
              {appointment.reason || 'Appointment'}
            </h1>
            <p className="font-mono text-code-sm text-muted-foreground">Ref: {appointment.id}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer data-icon="inline-start" />
            Print
          </Button>
        </CardContent>
      </Card>

      {/* ─── Appointment details ────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-5">
          <SectionLabel>Appointment details</SectionLabel>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Tile icon={<CalendarDays className="size-4" />} label="Date" value={dateOf(start)} />
            <Tile
              icon={<Clock className="size-4" />}
              label="Time"
              value={`${timeOf(start)} · ${duration} minutes`}
            />
            <Tile
              icon={<Stethoscope className="size-4" />}
              label="Specialty"
              value={specialisation}
            />
            <Tile
              icon={<Building2 className="size-4" />}
              label="Department"
              value={doctor?.department?.name ?? '—'}
            />
          </div>
        </CardContent>
      </Card>

      {/* ─── Attending physician ────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-5">
          <SectionLabel>Attending physician</SectionLabel>
          <div className="mt-4 flex items-center gap-3">
            <Avatar className="size-11">
              <AvatarFallback className="text-xs">{initialsOf(doctor?.user?.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">Dr. {doctor?.user?.name ?? '—'}</p>
              <p className="truncate text-sm text-muted-foreground">
                {specialisation} · {doctor?.yearsOfExperience ?? 0} yrs experience
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Reason / notes (only when present) ─────────────────────────── */}
      {appointment.notes?.trim() ? (
        <Card>
          <CardContent className="p-5">
            <SectionLabel>Notes</SectionLabel>
            <p className="mt-3 text-sm text-foreground">{appointment.notes}</p>
          </CardContent>
        </Card>
      ) : null}

      {/* ─── Cancellation record (only when cancelled) ──────────────────── */}
      {appointment.status === 'CANCELLED' ? (
        <div
          className="rounded-xl border p-4"
          style={{
            borderColor: 'color-mix(in oklab, var(--status-danger) 28%, transparent)',
            background: 'var(--status-danger-surface)',
          }}
        >
          <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--status-danger)]">
            <CalendarX2 className="size-4" />
            Appointment cancelled
          </p>
          {appointment.cancellationReason?.trim() ? (
            <p className="mt-1 text-xs text-[var(--status-danger)]">
              {appointment.cancellationReason}
            </p>
          ) : null}
        </div>
      ) : (
        /* ─── Pre-visit instructions ───────────────────────────────────── */
        <div
          className="rounded-xl border p-4"
          style={{
            borderColor: 'color-mix(in oklab, var(--status-warning) 35%, transparent)',
            background: 'var(--status-warning-surface)',
          }}
        >
          <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--status-warning)]">
            <TriangleAlert className="size-4" />
            Pre-visit instructions
          </p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {PRE_VISIT.map((item) => (
              <li key={item} className="flex gap-2 text-xs text-[var(--status-warning)]">
                <span aria-hidden>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ─── Footer actions ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link to="/patient/appointments/book">
            <RefreshCw data-icon="inline-start" />
            Reschedule
          </Link>
        </Button>
        {canCancel ? (
          <Button
            variant="outline"
            className="border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
            onClick={() => setCancelOpen(true)}
          >
            <CalendarX2 data-icon="inline-start" />
            Cancel appointment
          </Button>
        ) : null}
      </div>

      <CancelAppointmentModal
        appointment={appointment}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
      />
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{children}</p>
  )
}

function Tile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-muted/40 p-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  )
}

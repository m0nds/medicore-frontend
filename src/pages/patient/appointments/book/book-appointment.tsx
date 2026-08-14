import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { toast } from 'sonner'
import {
  BadgeCheck,
  CalendarCheck,
  CalendarPlus,
  Check,
  ChevronDown,
  ChevronLeft,
  Clock,
  Info,
  Pencil,
  Plus,
  Stethoscope,
  TriangleAlert,
  Users,
} from 'lucide-react'
import type { Doctor } from '@/types/doctor.type'
import { bookAppointmentSchema, type BookAppointmentBody } from '@/schemas/appointment.schema'
import { useDepartment, useDepartments } from '@/hooks/useDepartment'
import { useBookAppointment } from '@/hooks/useAppointment'
import { BookingStepper } from '@/components/booking-stepper'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { combineDateTime, downloadIcs, googleCalendarUrl, TIME_SLOTS, to12h } from '@/lib/helper'
import PageTitle from '@/components/custom/pageTitle'

const STEPS = ['Department', 'Doctor', 'Date & time', 'Details', 'Review', 'Confirmed']
const DURATION_MIN = 30;


const initialsOf = (name?: string) =>
  (name ?? '')
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'

const specialisationOf = (doctor: Doctor) => doctor.specialisations?.[0]?.specialisation?.name ?? doctor.department?.name ?? 'General';

export function BookAppointment() {
  const [step, setStep] = useState(0)
  const [departmentId, setDepartmentId] = useState<string>()
  const [doctorSel, setDoctorSel] = useState<string>() // 'ANY' | doctor.id
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>()

  const form = useForm<BookAppointmentBody>({
    resolver: zodResolver(bookAppointmentSchema),
    defaultValues: {
      doctorId: '',
      appointmentDate: '',
      scheduledAt: '',
      reason: '',
      notes: '',
      duration: DURATION_MIN,
    },
  })

  const book = useBookAppointment();

  const departmentsQ = useDepartments({ page: 1, limit: 50 })
  const departments = departmentsQ.data?.data ?? []
  const department = departments.find((d) => d.id === departmentId)

  const departmentDetailQ = useDepartment(departmentId ?? '', { enabled: !!departmentId })
  const doctors = departmentDetailQ.data?.data.doctors ?? []
  const availableDoctors = doctors.filter((d) => d.isAvailable)
  const resolvedDoctor = doctorSel === 'ANY' ? availableDoctors[0] : doctors.find((d) => d.id === doctorSel)

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const doctorId = form.watch('doctorId')
  const scheduledAt = form.watch('scheduledAt')
  const reason = form.watch('reason')

  const canProceed =
    step === 0
      ? !!departmentId
      : step === 1
        ? !!doctorId
        : step === 2
          ? !!scheduledAt
          : step === 3
            ? reason.trim().length > 0
            : true

  const selectDepartment = (id: string) => {
    setDepartmentId(id)
    setDoctorSel(undefined)
    form.setValue('doctorId', '')
  }

  const selectDoctor = (value: string, id: string) => {
    setDoctorSel(value)
    form.setValue('doctorId', id, { shouldValidate: true })
  }

  const syncSchedule = (d?: Date, t?: string) => {
    if (d && t) {
      form.setValue('scheduledAt', combineDateTime(d, t).toISOString(), { shouldValidate: true })
      const dateOnly = new Date(d)
      dateOnly.setHours(0, 0, 0, 0)
      form.setValue('appointmentDate', dateOnly.toISOString(), { shouldValidate: true })
    } else {
      form.setValue('scheduledAt', '')
      form.setValue('appointmentDate', '')
    }
  }

  const onValid = (values: BookAppointmentBody) => {
    book.mutate(
      { ...values, notes: values.notes?.trim() ? values.notes.trim() : undefined },
      {
        onSuccess: () => {
          setStep(5)
          toast.success('Appointment booked')
        },
      },
    )
  }

  const goNext = () => {
    if (step === 4) {
      form.handleSubmit(onValid)()
      return
    }
    setStep((s) => s + 1)
  }

  const reset = () => {
    setStep(0)
    setDepartmentId(undefined)
    setDoctorSel(undefined)
    setDate(undefined)
    setTime(undefined)
    form.reset()
  }

  const calendarEvent = () => ({
    title: resolvedDoctor ? `Appointment with Dr. ${resolvedDoctor.user.name}` : 'MediCore appointment',
    start: new Date(scheduledAt),
    durationMin: form.watch('duration') ?? DURATION_MIN,
    description: reason,
  })

  const handleDownloadIcs = () => {
    if (scheduledAt) downloadIcs(calendarEvent())
  }

  const openGoogleCalendar = () => {
    if (scheduledAt) window.open(googleCalendarUrl(calendarEvent()), '_blank', 'noopener,noreferrer')
  }

  // ─── Confirmed ───────────────────────────────────────────────────────────
  if (step === 5) {
    const when = scheduledAt ? new Date(scheduledAt) : null
    const durationMin = form.watch('duration') ?? DURATION_MIN

    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-5 py-6">
        <div className="flex size-10 items-center justify-center rounded-full bg-[var(--status-success-surface)] ring-8 ring-[var(--status-success-surface)]">
          <BadgeCheck className="size-9 text-[var(--status-success)]" />
        </div>

        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-foreground">Appointment confirmed!</h1>
          <p className="text-sm text-muted-foreground">
            You&apos;ll receive a confirmation email.
          </p>
        </div>

        <div className="w-full rounded-xl border bg-card p-5 text-left shadow-sm">
          {resolvedDoctor && (
            <div className="flex items-center gap-3">
              <Avatar className="size-11">
                <AvatarFallback className="text-sm">{initialsOf(resolvedDoctor.user.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-foreground">Dr. {resolvedDoctor.user.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {specialisationOf(resolvedDoctor)}
                  {department ? ` · ${department.name}` : ''}
                </p>
              </div>
            </div>
          )}

          <Separator className="my-4" />

          <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 text-sm">
            {when && (
              <ConfirmRow label="Date & time" value={format(when, 'EEEE, MMMM d, yyyy · h:mm a')} />
            )}
            <ConfirmRow label="Type" value={`${department?.name ?? 'Consultation'} · ${durationMin} minutes`} />
            {reason && <ConfirmRow label="Reason" value={reason} />}
          </dl>

          <div className="mt-4 -mx-5 -mb-5 flex items-start gap-2 rounded-br-lg rounded-bl-lg bg-[var(--status-warning-surface)] p-3 text-xs text-[var(--status-warning)]">
            <TriangleAlert className="mt-px size-4 shrink-0" />
            <span>Please arrive 15 minutes early and bring your insurance card and photo ID.</span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2">
          <Button asChild>
            <Link to="/patient/appointments">
              <CalendarCheck />
              View my appointments
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={!scheduledAt}>
                <CalendarPlus />
                Add to calendar
                <ChevronDown data-icon="inline-end" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={openGoogleCalendar}>Google Calendar</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadIcs}>Download .ics file</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            variant="outline" 
            onClick={reset}
          >
            <Plus />
            Book another appointment
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageTitle
        text={'Book Appointment'}
        description={'Choose a department, find the right doctor, and select a convenient date and time for your appointment.'}
      />

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <BookingStepper steps={STEPS} current={step} onStepClick={(i) => setStep(i)} />
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm">
        {/* ─── Step 0: Department ─────────────────────────────────────────── */}
        {step === 0 && (
          <section className="flex flex-col gap-4">
            <StepHeading title="Select a department" subtitle="Choose the medical specialty you need" />
            {departmentsQ.isLoading ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {departments.map((d) => {
                  const hasDoctors = (d.doctors?.length ?? 0) > 0
                  return (
                    <SelectCard
                      key={d.id}
                      selected={departmentId === d.id}
                      disabled={!hasDoctors}
                      onClick={() => selectDepartment(d.id)}
                    >
                      <IconTile>
                        <Stethoscope className="size-5 text-primary" />
                      </IconTile>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">{d.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {d.doctors?.length ?? 0} {d.doctors?.length === 1 ? 'doctor' : 'doctors'} available
                        </p>
                      </div>
                    </SelectCard>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* ─── Step 1: Doctor ─────────────────────────────────────────────── */}
        {step === 1 && (
          <section className="flex flex-col gap-4">
            <StepHeading
              title="Choose your doctor"
              subtitle={department ? `${department.name} · ${availableDoctors.length} available` : undefined}
            />
            {departmentDetailQ.isLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            ) : doctors.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No doctors listed for this department yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                <SelectCard
                  selected={doctorSel === 'ANY'}
                  disabled={availableDoctors.length === 0}
                  onClick={() => selectDoctor('ANY', availableDoctors[0]?.id ?? '')}
                >
                  <IconTile>
                    <Users className="size-5 text-primary" />
                  </IconTile>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">Any available doctor</p>
                    <p className="text-xs text-muted-foreground">We'll match you with the earliest opening</p>
                  </div>
                </SelectCard>

                {doctors.map((d) => (
                  <SelectCard
                    key={d.id}
                    selected={doctorSel === d.id}
                    disabled={!d.isAvailable}
                    onClick={() => selectDoctor(d.id, d.id)}
                  >
                    <Avatar className="size-10">
                      <AvatarFallback className="text-xs">{initialsOf(d.user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-semibold text-foreground">
                        <span className="truncate">Dr. {d.user.name}</span>
                        {!d.isAvailable && <Badge variant="muted">Not accepting</Badge>}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {specialisationOf(d)} · {d.yearsOfExperience} yrs experience
                      </p>
                    </div>
                  </SelectCard>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ─── Step 2: Date & time ────────────────────────────────────────── */}
        {step === 2 && (
          <section className="flex flex-col gap-4">
            <StepHeading title="Pick a date and time" subtitle="30-minute appointment" />
            <div className="flex items-start gap-2 rounded-lg border border-[var(--status-info-surface)] bg-[var(--status-info-surface)] p-3 text-xs text-[var(--status-info)]">
              <Info className="mt-px size-4 shrink-0" />
              <span>
                Times shown are standard clinic hours. Live per-doctor availability isn't wired up yet — the slot
                you pick is submitted as requested.
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-[auto_1fr]">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d)
                  syncSchedule(d, time)
                }}
                disabled={{ before: today }}
                className="rounded-lg border"
              />
              <div className="flex flex-col gap-2">
                <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Clock className="size-4 text-muted-foreground" />
                  {date ? format(date, 'EEEE, MMM d') : 'Select a date first'}
                </p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {TIME_SLOTS.map((t) => (
                    <Button
                      key={t}
                      type="button"
                      size="sm"
                      variant={time === t ? 'primary' : 'outline'}
                      disabled={!date}
                      onClick={() => {
                        setTime(t)
                        syncSchedule(date, t)
                      }}
                    >
                      {to12h(t)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── Step 3: Details ────────────────────────────────────────────── */}
        {step === 3 && (
          <section className="flex flex-col gap-4">
            <StepHeading title="Visit details" subtitle="Help the care team prepare for your visit" />
            <FieldGroup>
              <Field data-invalid={!!form.formState.errors.reason}>
                <FieldLabel htmlFor="reason">Reason for visit</FieldLabel>
                <Textarea
                  id="reason"
                  rows={3}
                  placeholder="Briefly describe your symptoms or the reason for this visit"
                  aria-invalid={!!form.formState.errors.reason}
                  {...form.register('reason')}
                />
                <FieldError errors={form.formState.errors.reason ? [form.formState.errors.reason] : undefined} />
              </Field>
              <Field>
                <FieldLabel htmlFor="notes">Additional notes (optional)</FieldLabel>
                <Textarea
                  id="notes"
                  rows={3}
                  placeholder="Anything else the care team should know?"
                  {...form.register('notes')}
                />
                <FieldDescription>Medications, allergies, or context for your visit.</FieldDescription>
              </Field>
            </FieldGroup>
          </section>
        )}

        {/* ─── Step 4: Review ─────────────────────────────────────────────── */}
        {step === 4 && (
          <section className="flex flex-col gap-4">
            <StepHeading title="Review & confirm" subtitle="Check the details before booking" />
            <dl className="divide-y rounded-lg border">
              <ReviewRow label="Department" value={department?.name} onEdit={() => setStep(0)} />
              <ReviewRow
                label="Doctor"
                value={resolvedDoctor ? `Dr. ${resolvedDoctor.user.name}` : undefined}
                hint={doctorSel === 'ANY' ? 'Earliest available' : undefined}
                onEdit={() => setStep(1)}
              />
              <ReviewRow
                label="Date & time"
                value={scheduledAt ? format(new Date(scheduledAt), 'EEE, MMM d, yyyy · h:mm a') : undefined}
                onEdit={() => setStep(2)}
              />
              <ReviewRow label="Reason" value={reason} onEdit={() => setStep(3)} />
              {form.watch('notes')?.trim() ? (
                <ReviewRow label="Notes" value={form.watch('notes')} onEdit={() => setStep(3)} />
              ) : null}
              <ReviewRow label="Duration" value={`${form.watch('duration') ?? DURATION_MIN} minutes`} />
            </dl>
          </section>
        )}

        {/* ─── Footer nav ─────────────────────────────────────────────────── */}
        <div className="mt-6 flex items-center justify-between border-t pt-4">
          {step === 0 ? (
            <Button
              className='w-40 -py-6'
              type="button"
              variant="ghost"
              onClick={() => { window.history.back()}}
            >
              Cancel
            </Button>
          ) : (
            <Button
            className='w-40 -py-6'
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            disabled={step === 0 || book.isPending}
          >
            <ChevronLeft data-icon="inline-start" />
            Back
          </Button>
          )}
          <Button
            className='w-40 -py-6'
            type="button" 
            onClick={goNext} 
            disabled={!canProceed || book.isPending}
          >
            {book.isPending ? <Spinner data-icon="inline-start" /> : null}
            {step === 4 ? 'Confirm booking' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Small building blocks ───────────────────────────────────────────────────
function StepHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="space-y-0.5">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">{children}</div>
  )
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </>
  )
}

function SelectCard({
  selected,
  disabled,
  onClick,
  children,
}: {
  selected: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border bg-card p-4 text-left transition-colors',
        selected ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/40 hover:bg-secondary/40',
        disabled && 'cursor-not-allowed opacity-50 hover:border-border hover:bg-card',
      )}
    >
      {children}
      <span
        className={cn(
          'ml-auto flex size-5 shrink-0 items-center justify-center rounded-full border',
          selected ? 'border-primary bg-primary text-primary-foreground' : 'border-input',
        )}
      >
        {selected && <Check className="size-3.5" />}
      </span>
    </button>
  )
}

function ReviewRow({
  label,
  value,
  hint,
  onEdit,
}: {
  label: string
  value?: string
  hint?: string
  onEdit?: () => void
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="text-sm font-medium text-foreground">
          {value || <span className="text-muted-foreground">—</span>}
          {hint && <span className="ml-1 text-xs font-normal text-muted-foreground">({hint})</span>}
        </dd>
      </div>
      {onEdit && (
        <Button
          variant="ghost"
          size='xs'
          onClick={onEdit}
          className="shrink-0 text-xs font-medium text-primary"
        >
          <Pencil className='w-4 h-4' />
          Edit
        </Button>
      )}
    </div>
  )
}

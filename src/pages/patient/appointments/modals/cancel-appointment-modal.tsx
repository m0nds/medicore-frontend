import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { CalendarClock, TriangleAlert } from 'lucide-react'
import type { Appointment } from '@/types/appointment.type'
import { cancelAppointmentSchema, type CancelAppointmentBody } from '@/schemas/appointment.schema'
import { useCancelAppointment } from '@/hooks/useAppointment'
import { dateFormatter, initialsOf, STATUS_VARIANT } from '@/lib/helper'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

// Structured quick-picks — faster than free text and cleaner for the record.
const QUICK_REASONS = [
  'Feeling better',
  'Scheduling conflict',
  'Seen elsewhere',
  'Transportation',
  'Cost concern',
  'Other',
]

interface CancelAppointmentModalProps {
  appointment: Appointment
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CancelAppointmentModal({ appointment, open, onOpenChange }: CancelAppointmentModalProps) {
  const cancel = useCancelAppointment()

  const form = useForm<CancelAppointmentBody>({
    resolver: zodResolver(cancelAppointmentSchema),
    defaultValues: { cancellationReason: '' },
  })
  const reason = form.watch('cancellationReason')
  const [showOtherReason, setShowOtherReason] = useState(false)

  const doctorName = appointment.doctor?.user?.name
  const specialisation =
    appointment.doctor?.specialisations?.[0]?.specialisation?.name ??
    appointment.doctor?.department?.name ??
    'General'

  // Duty-of-care advisory for near-term cancellations.
  const hoursAway = (new Date(appointment.scheduledAt).getTime() - Date.now()) / 36e5
  const isSoon = hoursAway > 0 && hoursAway < 24

  const onSubmit = (values: CancelAppointmentBody) => {
    cancel.mutate(
      { id: appointment.id, data: { cancellationReason: values.cancellationReason.trim() } },
      {
        onSuccess: () => {
          toast.success('Appointment cancelled');
          form.reset({});
          onOpenChange(false);
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex size-11 items-center justify-center rounded-full bg-[var(--status-danger-surface)]">
            <CalendarClock className="size-5 text-[var(--status-danger)]" />
          </div>
          <DialogTitle className={cn('!text-h3 font-semibold text-gray-900')}>Cancel appointment</DialogTitle>
          <DialogDescription className={cn('!text-code-sm')}>
            Review the details before cancelling the time slot will be released to other patients.
          </DialogDescription>
        </DialogHeader>

        {/* Near-term advisory */}
        {isSoon && (
          <div className="flex items-start gap-2 rounded-lg bg-[var(--status-warning-surface)] p-3 text-xs text-[var(--status-warning)]">
            <TriangleAlert className="mt-px size-4 shrink-0" />
            <span>
              This appointment is less than 24 hours away. Please cancel only if necessary so the slot can be
              offered to another patient.
            </span>
          </div>
        )}

        {/* Appointment summary */}
        <div className="rounded-xl border bg-muted/40 p-4 my-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback className="text-xs">{initialsOf(doctorName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">Dr. {doctorName ?? '—'}</p>
              <p className="truncate text-xs text-muted-foreground">{specialisation}</p>
            </div>
            <Badge variant={STATUS_VARIANT[appointment.status]} className="ml-auto capitalize gap-1.5">
              <span className="size-1.5 rounded-full bg-current" />
              {appointment.status.replace('_', ' ').toLowerCase()}
            </Badge>
          </div>
          <div className="mt-3 flex items-center gap-1.5 border-t pt-3 text-sm text-foreground">
            <CalendarClock className="size-4 text-muted-foreground" />
            {dateFormatter(appointment.scheduledAt)}
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <FieldLabel>Reason for cancellation</FieldLabel>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  const isOther = r === 'Other'
                  setShowOtherReason(isOther)
                  form.setValue('cancellationReason', isOther ? '' : r, { shouldValidate: true })
                }}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-xs transition-colors',
                  showOtherReason
                    ? r === 'Other'
                      ? 'border-primary bg-secondary text-secondary-foreground'
                      : 'border-border text-muted-foreground hover:bg-muted'
                    : reason === r
                      ? 'border-primary bg-secondary text-secondary-foreground'
                      : 'border-border text-muted-foreground hover:bg-muted',
                )}
              >
                {r}
              </button>
            ))}
          </div>

          {showOtherReason && (
            <Field data-invalid={!!form.formState.errors.cancellationReason}>
              <Textarea
                id="cancellationReason"
                rows={3}
                placeholder="Add a brief reason"
                aria-invalid={!!form.formState.errors.cancellationReason}
                {...form.register('cancellationReason')}
              />
              <FieldError
                errors={
                  form.formState.errors.cancellationReason
                    ? [form.formState.errors.cancellationReason]
                    : undefined
                }
              />
            </Field>
          )}

          <p className="text-xs text-muted-foreground">
            Prefer a different time?{' '}
            <Link
              to="/patient/appointments/book"
              onClick={() => onOpenChange(false)}
              className="font-medium text-primary hover:underline"
            >
              Reschedule
            </Link>
          </p>

          <DialogFooter className="mt-1">
            <Button
              size='sm'
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={cancel.isPending}
            >
              Keep appointment
            </Button>
            <Button 
              type="submit"
              size='sm'
              variant="danger" 
              disabled={cancel.isPending || reason.trim().length === 0}
            >
              {cancel.isPending ? <Spinner data-icon="inline-start" /> : null}
              Cancel appointment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

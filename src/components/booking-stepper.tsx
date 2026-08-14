import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookingStepperProps {
  steps: string[]
  /** Index of the current step (0-based). */
  current: number
  /** Allow jumping back to an already-completed step. */
  onStepClick?: (index: number) => void
}

export function BookingStepper({ steps, current, onStepClick }: BookingStepperProps) {
  return (
    <ol className="flex items-start">
      {steps.map((label, i) => {
        const status = i < current ? 'done' : i === current ? 'active' : 'upcoming'
        const clickable = i < current && !!onStepClick

        return (
          <li key={label} className={cn('flex items-start', i < steps.length - 1 && 'flex-1')}>
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick?.(i)}
                aria-current={status === 'active' ? 'step' : undefined}
                className={cn(
                  'flex size-8 items-center justify-center rounded-full border text-sm font-semibold transition-colors',
                  status === 'active' && 'border-primary bg-primary text-primary-foreground',
                  status === 'done' && 'border-success bg-success text-white',
                  status === 'upcoming' && 'border-border bg-muted text-muted-foreground',
                  clickable && 'cursor-pointer hover:opacity-90',
                )}
              >
                {status === 'done' ? <Check className="size-4" /> : i + 1}
              </button>
              <span
                className={cn(
                  'whitespace-nowrap text-xs',
                  status === 'upcoming' ? 'text-muted-foreground' : 'font-medium text-foreground',
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn('mt-4 h-0.5 flex-1 rounded', i < current ? 'bg-success' : 'bg-border')}
                aria-hidden
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

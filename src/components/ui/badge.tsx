import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        // Generic
        default: "border-transparent bg-primary text-primary-foreground [a]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        outline: "border-border text-foreground [a]:hover:bg-muted",

        // Clinical status — tinted surface + status text (docs/DESIGN.md).
        // Confirmed / Normal lab result
        success:
          "border-[color-mix(in_oklab,var(--status-success)_22%,transparent)] bg-[var(--status-success-surface)] text-[var(--status-success)]",
        // In progress / active consultation
        progress:
          "border-[color-mix(in_oklab,var(--status-progress)_22%,transparent)] bg-[var(--status-progress-surface)] text-[var(--status-progress)]",
        // Waiting / abnormal lab result
        warning:
          "border-[color-mix(in_oklab,var(--status-warning)_22%,transparent)] bg-[var(--status-warning-surface)] text-[var(--status-warning)]",
        // Scheduled / informational
        info:
          "border-[color-mix(in_oklab,var(--status-info)_22%,transparent)] bg-[var(--status-info-surface)] text-[var(--status-info)]",
        // Completed / pending
        neutral:
          "border-[color-mix(in_oklab,var(--status-neutral)_22%,transparent)] bg-[var(--status-neutral-surface)] text-[var(--status-neutral)]",
        // Cancelled / critical
        danger:
          "border-[color-mix(in_oklab,var(--status-danger)_22%,transparent)] bg-[var(--status-danger-surface)] text-[var(--status-danger)]",
        // No show
        muted:
          "border-[color-mix(in_oklab,var(--status-muted)_28%,transparent)] bg-[var(--status-muted-surface)] text-[var(--status-muted)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

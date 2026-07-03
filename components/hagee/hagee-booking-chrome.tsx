import {
  selectionCardClass,
  selectionDateChipClass,
  selectionPillClass,
} from "@/lib/hagu-selection-styles"
import { cn } from "@/lib/utils"

/** Selected option pill — delegates to shared selection styles. */
export function bookingPillClass(selected: boolean) {
  return cn(selectionPillClass(selected, "compact"))
}

/** Selectable card — black border when selected. */
export function bookingCardClass(selected: boolean) {
  return cn(
    "rounded-[20px] text-left transition shadow-[0px_2px_8px_rgba(26,26,30,0.04)]",
    selectionCardClass(selected),
  )
}

/** Date chip in horizontal scroller */
export function bookingDateClass(selected: boolean) {
  return cn(
    "flex min-w-[64px] shrink-0 flex-col items-center rounded-[16px] px-3 py-3 transition",
    selectionDateChipClass(selected),
  )
}

/** Accent banner — matches provider home requests banner */
export function bookingBannerClass() {
  return "rounded-[16px] border border-hagu-border bg-hagu-canvas px-4 py-3.5"
}

export function BookingStepHeading({
  title,
  subtitle,
  stepLabel,
}: {
  title: string
  subtitle?: string
  stepLabel?: string
}) {
  return (
    <div className="space-y-1.5">
      {stepLabel ? <p className="text-[11px] font-semibold uppercase tracking-wide text-hagu-text-secondary">{stepLabel}</p> : null}
      <h1 className="hagu-page-title">{title}</h1>
      {subtitle ? <p className="text-sm font-light text-hagu-text-secondary">{subtitle}</p> : null}
    </div>
  )
}

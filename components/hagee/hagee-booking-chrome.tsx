import { cn } from "@/lib/utils"

/** Selected option — matches hosting pills / primary chips in Figma 2468:20298 */
export function bookingPillClass(selected: boolean) {
  return cn(
    "rounded-full border px-4 py-2.5 text-[13px] font-medium transition",
    selected
      ? "border-hagu-ink bg-hagu-ink text-white"
      : "border-black/[0.08] bg-hagu-white text-hagu-label",
  )
}

/** Selectable card — matches profile basics / rates cards */
export function bookingCardClass(selected: boolean) {
  return cn(
    "rounded-[20px] border text-left transition",
    selected
      ? "border-2 border-hagu-accent-strong bg-hagu-accent-soft"
      : "border border-hagu-border bg-hagu-white shadow-[0px_2px_8px_rgba(26,26,30,0.04)]",
  )
}

/** Date chip in horizontal scroller */
export function bookingDateClass(selected: boolean) {
  return cn(
    "flex min-w-[64px] shrink-0 flex-col items-center rounded-[16px] border px-3 py-3 transition",
    selected
      ? "border-2 border-hagu-ink bg-hagu-white text-hagu-ink"
      : "border border-hagu-border bg-hagu-white text-hagu-label",
  )
}

/** Accent banner — matches provider home requests banner */
export function bookingBannerClass() {
  return "rounded-[16px] bg-hagu-accent-soft px-4 py-3.5"
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
      {stepLabel ? <p className="text-[11px] font-semibold uppercase tracking-wide text-hagu-accent-strong">{stepLabel}</p> : null}
      <h1 className="hagu-page-title">{title}</h1>
      {subtitle ? <p className="text-sm font-light text-hagu-text-secondary">{subtitle}</p> : null}
    </div>
  )
}

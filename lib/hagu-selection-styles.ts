import { cn } from "@/lib/utils"

/**
 * HAGU selection styles — black selected state (Figma 2468:20298).
 * Use these for pills, chips, and selectable cards. Do not use teal accent for selection.
 */

export function selectionPillClass(
  selected: boolean,
  size: "default" | "sm" | "compact" = "default",
) {
  return cn(
    "rounded-full font-medium transition",
    size === "sm" && "h-9 px-3.5 text-[12px]",
    size === "default" && "h-11 px-5 text-[13px]",
    size === "compact" && "border px-[17px] py-2 text-[13px]",
    selected
      ? "bg-hagu-heading text-hagu-white"
      : "border border-hagu-border bg-hagu-white text-hagu-label hover:bg-black/[0.03]",
  )
}

export function selectionCardClass(selected: boolean) {
  return cn(
    selected ? "border-2 border-hagu-heading bg-hagu-white" : "border border-hagu-border bg-hagu-white",
  )
}

export function selectionRowClass(selected: boolean) {
  return cn(
    selected ? "border-2 border-hagu-heading bg-hagu-white" : "border border-hagu-border bg-hagu-white",
  )
}

export function selectionCheckIndicatorClass(selected: boolean) {
  return cn(
    "flex size-[22px] shrink-0 items-center justify-center rounded-full border",
    selected ? "border-hagu-heading bg-hagu-heading" : "border-hagu-border bg-transparent",
  )
}

export function selectionDateChipClass(selected: boolean) {
  return cn(
    selected
      ? "border-2 border-hagu-heading bg-hagu-white text-hagu-ink"
      : "border border-hagu-border bg-hagu-white text-hagu-label",
  )
}

/** Segmented control track — white pill with soft shadow. */
export function selectionSegmentTrackClass() {
  return "flex rounded-full bg-hagu-white p-1 shadow-[0px_2px_12px_rgba(26,26,30,0.08)]"
}

/** Segmented control segment — black active pill, grey inactive label. */
export function selectionSegmentClass(selected: boolean) {
  return cn(
    "flex-1 rounded-full py-2.5 text-[13px] font-medium transition",
    selected ? "bg-hagu-heading text-hagu-white" : "text-hagu-text-secondary",
  )
}

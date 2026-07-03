"use client"

import type { LucideIcon } from "lucide-react"
import { Check } from "lucide-react"
import {
  selectionCheckIndicatorClass,
  selectionRowClass,
} from "@/lib/hagu-selection-styles"
import { cn } from "@/lib/utils"

interface HageeSelectableRowProps {
  icon: LucideIcon
  label: string
  subtitle: string
  selected: boolean
  onClick: () => void
}

export function HageeSelectableRow({ icon: Icon, label, subtitle, selected, onClick }: HageeSelectableRowProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-[16px] px-4 py-4 text-left transition",
        selectionRowClass(selected),
      )}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-hagu-border bg-hagu-canvas">
        <Icon className="size-[18px] text-hagu-label" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-hagu-ink">{label}</p>
        <p className="text-xs text-hagu-text-secondary">{subtitle}</p>
      </div>
      <div className={selectionCheckIndicatorClass(selected)}>
        {selected ? <Check className="size-2.5 text-white" strokeWidth={3} /> : null}
      </div>
    </button>
  )
}

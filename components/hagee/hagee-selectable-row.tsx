"use client"

import type { LucideIcon } from "lucide-react"
import { Check } from "lucide-react"
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
        "flex w-full items-center gap-3.5 rounded-[16px] border px-4 py-4 text-left transition",
        selected
          ? "border-2 border-hagu-accent-strong bg-hagu-accent-soft"
          : "border border-hagu-border bg-hagu-white",
      )}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-hagu-surface-muted">
        <Icon className="size-[18px] text-hagu-label" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-hagu-ink">{label}</p>
        <p className="text-xs text-hagu-text-secondary">{subtitle}</p>
      </div>
      <div
        className={cn(
          "flex size-[22px] shrink-0 items-center justify-center rounded-full border",
          selected ? "border-hagu-accent-strong bg-hagu-accent-strong" : "border-hagu-border bg-transparent",
        )}
      >
        {selected ? <Check className="size-2.5 text-white" strokeWidth={3} /> : null}
      </div>
    </button>
  )
}

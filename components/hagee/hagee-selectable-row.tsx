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
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-[16px] border px-4 py-4 text-left transition",
        selected ? "border-hagu-accent-strong bg-hagu-accent-selected" : "border-hagu-border bg-hagu-white",
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          selected ? "bg-hagu-accent-soft" : "bg-hagu-surface-muted",
        )}
      >
        <Icon className={cn("size-[18px]", selected ? "text-hagu-accent-strong" : "text-hagu-label")} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-hagu-ink">{label}</p>
        <p className="text-xs text-hagu-text-secondary">{subtitle}</p>
      </div>
      <div
        className={cn(
          "flex size-[22px] shrink-0 items-center justify-center rounded-[11px] border",
          selected ? "border-hagu-accent-strong bg-hagu-accent-strong" : "border-black/[0.14] bg-transparent",
        )}
      >
        {selected ? <Check className="size-2.5 text-white" strokeWidth={3} /> : null}
      </div>
    </button>
  )
}

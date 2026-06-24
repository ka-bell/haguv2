"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface HageeActivityCardProps {
  icon: LucideIcon
  label: string
  subtitle: string
  selected: boolean
  onClick: () => void
  className?: string
}

export function HageeActivityCard({
  icon: Icon,
  label,
  subtitle,
  selected,
  onClick,
  className,
}: HageeActivityCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-[114px] flex-col rounded-[16px] border p-3.5 text-left transition",
        selected
          ? "border-hagu-accent-strong bg-hagu-accent-selected"
          : "border-hagu-border bg-hagu-white",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-[10px]",
          selected ? "bg-hagu-accent-soft" : "bg-hagu-surface-muted",
        )}
      >
        <Icon className={cn("size-[18px]", selected ? "text-hagu-accent-strong" : "text-hagu-label")} />
      </div>
      <p className={cn("mt-2.5 text-[13px] font-medium", selected ? "text-hagu-accent-strong" : "text-hagu-ink")}>
        {label}
      </p>
      <p className="mt-0.5 text-[11px] text-hagu-text-secondary">{subtitle}</p>
    </button>
  )
}

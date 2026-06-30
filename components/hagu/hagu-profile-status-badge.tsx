import { cn } from "@/lib/utils"

type HaguProfileStatusBadgeProps = {
  active: boolean
  className?: string
}

export function HaguProfileStatusBadge({ active, className }: HaguProfileStatusBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        active ? "bg-hagu-accent-selected text-hagu-accent-strong" : "bg-hagu-surface-muted text-hagu-text-secondary",
        className,
      )}
    >
      {active ? "Active" : "Paused"}
    </span>
  )
}

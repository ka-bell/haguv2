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
        active ? "bg-[#EAF7F5] text-[#3DA89E]" : "bg-[#F7F6F3] text-[#8A8A96]",
        className,
      )}
    >
      {active ? "Active" : "Paused"}
    </span>
  )
}

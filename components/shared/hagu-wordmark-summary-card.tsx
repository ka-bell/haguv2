"use client"

import { HaguWordmark } from "@/components/hagu/hagu-wordmark"
import { cn } from "@/lib/utils"

export type WordmarkSummaryStat = {
  label: string
  value: string
  valueClassName?: string
}

type HaguWordmarkSummaryCardProps = {
  periodLabel: string
  amount: string
  stats: WordmarkSummaryStat[]
  onClick?: () => void
  className?: string
}

/** Dark earnings summary card with decorative HAGU wordmark — HAGU provider home only. */
export function HaguWordmarkSummaryCard({
  periodLabel,
  amount,
  stats,
  onClick,
  className,
}: HaguWordmarkSummaryCardProps) {
  const content = (
    <div className="relative overflow-hidden rounded-[24px] bg-[#2D1012]/10 px-3.5 py-6 backdrop-blur-[20px]">
      <p className="text-xs font-medium uppercase tracking-wide text-white/50">{periodLabel}</p>
      <p className="mt-1 text-[36px] font-bold tracking-tight text-white">{amount}</p>
      <div className="mt-3 flex gap-5 border-t border-white/10 pt-3">
        {stats.map((stat, index) => (
          <div key={stat.label} className="contents">
            {index > 0 ? <div className="w-px self-stretch bg-white/10" aria-hidden /> : null}
            <div>
              <p className="text-[11px] text-white/40">{stat.label}</p>
              <p className={cn("text-base text-white", stat.valueClassName)}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      <HaguWordmark className="pointer-events-none absolute -right-3 -top-3 h-[118px] w-[114px] -rotate-[28deg]" />
      <HaguWordmark className="pointer-events-none absolute bottom-1 right-3 h-11 w-11 rotate-[14deg]" />
    </div>
  )

  if (!onClick) {
    return <div className={cn("relative overflow-hidden rounded-[24px] bg-[#2D1012] p-6", className)}>{content}</div>
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full overflow-hidden rounded-[24px] bg-[#2D1012] p-6 text-left transition active:opacity-95",
        className,
      )}
    >
      {content}
    </button>
  )
}

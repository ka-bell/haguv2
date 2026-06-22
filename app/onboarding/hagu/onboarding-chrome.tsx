"use client"

import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import type { HaguStep } from "./data"

export function OnboardingChrome({
  step,
  onBack,
  showProgress = true,
}: {
  step: HaguStep
  onBack: () => void
  showProgress?: boolean
}) {
  const progress = step <= 1 ? 0 : ((step - 1) / 8) * 100

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to previous step"
        className="flex size-9 items-center justify-center rounded-[18px] border border-black/8 bg-white"
      >
        <ChevronLeft className="size-4 text-[#2D1012]" />
      </button>
      {showProgress ? (
        <div className="h-[3px] w-full rounded-full bg-black/7">
          <div className="h-[3px] rounded-full bg-[#1a1a1e] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      ) : null}
    </div>
  )
}

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-xs font-semibold uppercase tracking-wide text-[#4A4A52]", className)}>{children}</p>
}

export function CharacterCard({
  emoji,
  title,
  subtitle,
  selected,
  onClick,
}: {
  emoji: string
  title: string
  subtitle: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col gap-1 rounded-2xl border p-4 text-left transition",
        selected ? "border-[#5BBFB5] bg-[rgba(208,241,240,0.4)] shadow-[0_0_0_1px_#5BBFB5]" : "border-black/[0.08] bg-white",
      )}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-sm font-semibold text-[#2D1012]">{title}</span>
      <span className="text-[11px] text-[#8a8a96]">{subtitle}</span>
    </button>
  )
}

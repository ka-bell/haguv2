"use client"

import { cn } from "@/lib/utils"

interface HaguFlowCtaProps {
  label: string
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function HaguFlowCta({ label, onClick, disabled, className }: HaguFlowCtaProps) {
  return (
    <div
      className={cn(
        "shrink-0 border-t border-black/[0.06] bg-[#FCFFFF] px-4 pt-4",
        className,
      )}
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="mx-auto flex h-16 w-full max-w-[340px] items-center justify-center rounded-[32px] bg-[#2D1012] text-base font-semibold tracking-tight text-white shadow-[0px_20px_40px_-10px_rgba(45,16,18,0.1)] transition enabled:hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {label}
      </button>
    </div>
  )
}

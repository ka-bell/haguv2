"use client"

import Link from "next/link"
import { ChevronLeft, X } from "lucide-react"
import { cn } from "@/lib/utils"

function GlassChrome({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-[45px] items-center justify-center rounded-[32px] border border-[#D0F1F0]/30 bg-white/20 px-[15px] backdrop-blur-[20px]",
        className,
      )}
    >
      {children}
    </div>
  )
}

interface HaguFlowHeaderProps {
  onBack?: () => void
  /** Shown only when `onBack` is set. Defaults to `/`. Pass `null` to hide close while keeping back. */
  closeHref?: string | null
  className?: string
}

export function HaguFlowHeader({ onBack, closeHref = "/", className }: HaguFlowHeaderProps) {
  if (!onBack) {
    return (
      <header className={cn("flex w-full justify-center", className)}>
        <GlassChrome className="w-[147px] px-1">
          <span className="text-lg font-bold tracking-tight text-[#2D1012]">HAGU</span>
        </GlassChrome>
      </header>
    )
  }

  const showClose = closeHref != null

  return (
    <header className={cn("flex w-full items-center justify-center gap-[50px] pl-2.5", className)}>
      <button type="button" onClick={onBack} aria-label="Go back">
        <GlassChrome className="w-[46px]">
          <ChevronLeft className="size-4 text-[#2D1012]" />
        </GlassChrome>
      </button>

      <GlassChrome className="w-[147px] px-1">
        <span className="text-lg font-bold tracking-tight text-[#2D1012]">HAGU</span>
      </GlassChrome>

      {showClose ? (
        <Link href={closeHref} aria-label="Close">
          <GlassChrome className="w-[52px]">
            <X className="size-[18px] text-[#2D1012]" />
          </GlassChrome>
        </Link>
      ) : (
        <div className="w-[52px]" aria-hidden="true" />
      )}
    </header>
  )
}

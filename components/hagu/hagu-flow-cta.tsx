"use client"

import type { ReactNode } from "react"
import { ScreenFooter, ScreenPrimaryButton } from "@/components/ui/screen-footer"
import { cn } from "@/lib/utils"

interface HaguFlowCtaProps {
  label: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  pinned?: boolean
  variant?: "primary" | "compact"
}

export function HaguFlowCta({
  label,
  onClick,
  disabled,
  className,
  pinned = true,
  variant = "primary",
}: HaguFlowCtaProps) {
  return (
    <ScreenFooter
      className={cn(variant === "compact" && "hagu-screen-footer-compact", className)}
      pinned={pinned}
    >
      {variant === "compact" ? (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className="hagu-btn-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          {label}
        </button>
      ) : (
        <ScreenPrimaryButton onClick={onClick} disabled={disabled}>
          {label}
        </ScreenPrimaryButton>
      )}
    </ScreenFooter>
  )
}

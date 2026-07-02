"use client"

import type { ReactNode } from "react"
import { ScreenFooter, ScreenPrimaryButton } from "@/components/ui/screen-footer"

interface HaguFlowCtaProps {
  label: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  pinned?: boolean
}

export function HaguFlowCta({ label, onClick, disabled, className, pinned = true }: HaguFlowCtaProps) {
  return (
    <ScreenFooter className={className} pinned={pinned}>
      <ScreenPrimaryButton onClick={onClick} disabled={disabled}>
        {label}
      </ScreenPrimaryButton>
    </ScreenFooter>
  )
}

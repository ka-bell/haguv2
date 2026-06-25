"use client"

import { ScreenFooter, ScreenPrimaryButton } from "@/components/ui/screen-footer"

interface HaguFlowCtaProps {
  label: string
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function HaguFlowCta({ label, onClick, disabled, className }: HaguFlowCtaProps) {
  return (
    <ScreenFooter className={className}>
      <ScreenPrimaryButton onClick={onClick} disabled={disabled}>
        {label}
      </ScreenPrimaryButton>
    </ScreenFooter>
  )
}

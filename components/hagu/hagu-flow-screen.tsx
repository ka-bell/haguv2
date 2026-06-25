"use client"

import { cn } from "@/lib/utils"
import { ScreenLayout } from "@/components/ui/screen-layout"
import { HaguFlowCta } from "./hagu-flow-cta"
import { HaguFlowHeader } from "./hagu-flow-header"

interface HaguFlowScreenProps {
  children: React.ReactNode
  onBack?: () => void
  closeHref?: string | null
  showHeader?: boolean
  progress?: number
  ctaLabel: string
  onCta: () => void
  ctaDisabled?: boolean
  footer?: React.ReactNode
  className?: string
}

export function HaguFlowScreen({
  children,
  onBack,
  closeHref,
  showHeader = true,
  progress,
  ctaLabel,
  onCta,
  ctaDisabled,
  footer,
  className,
}: HaguFlowScreenProps) {
  const reserveHeader = showHeader

  return (
    <ScreenLayout
      className={className}
      reserveHeader={reserveHeader}
      headerVariant="flowHagu"
      header={
        reserveHeader ? (
          <HaguFlowHeader onBack={onBack} closeHref={closeHref} className="hagu-brand-transition" />
        ) : undefined
      }
      footer={<HaguFlowCta label={ctaLabel} onClick={onCta} disabled={ctaDisabled} />}
    >
      {typeof progress === "number" ? (
        <div className="h-[3px] w-full rounded-full bg-black/[0.07]">
          <div
            className="h-[3px] rounded-full bg-[#1A1A1E] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}
      <div className={cn("flex-1 pb-6", typeof progress === "number" ? "mt-5" : null)}>{children}</div>
      {footer}
    </ScreenLayout>
  )
}

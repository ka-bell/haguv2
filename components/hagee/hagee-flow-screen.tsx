"use client"

import { cn } from "@/lib/utils"
import { PAGE_HAGEE_FLOW_HEADER_OFFSET } from "@/components/ui/page-shell"
import { ScreenLayout } from "@/components/ui/screen-layout"
import { HaguFlowCta } from "@/components/hagu/hagu-flow-cta"
import { HaguFlowHeader } from "@/components/hagu/hagu-flow-header"
import { HageeFlowHeader } from "./hagee-flow-header"

/** @deprecated Use PAGE_HAGEE_FLOW_HEADER_OFFSET from screen-layout. */
export const HAGEE_FLOW_HEADER_OFFSET = PAGE_HAGEE_FLOW_HEADER_OFFSET

interface HageeFlowScreenProps {
  children: React.ReactNode
  onBack?: () => void
  progress?: number
  /** Top-right action on intro steps (e.g. Skip). */
  headerAction?: React.ReactNode
  ctaLabel: string
  onCta: () => void
  ctaDisabled?: boolean
  footer?: React.ReactNode
  className?: string
}

export function HageeFlowScreen({
  children,
  onBack,
  progress,
  headerAction,
  ctaLabel,
  onCta,
  ctaDisabled,
  footer,
  className,
}: HageeFlowScreenProps) {
  const hasFlowHeader = Boolean(onBack)

  return (
    <ScreenLayout
      className={cn("bg-hagu-canvas text-hagu-ink", className)}
      contentPadding="px-7"
      headerClassName="px-7"
      reserveHeader
      headerVariant={hasFlowHeader ? "flowHagee" : "none"}
      header={
        hasFlowHeader ? (
          <HageeFlowHeader onBack={onBack!} progress={progress} />
        ) : (
          <div className="relative flex w-full items-center justify-center">
            <HaguFlowHeader className="hagu-brand-transition" />
            {headerAction ? (
              <div className="absolute right-0 top-1/2 -translate-y-1/2">{headerAction}</div>
            ) : null}
          </div>
        )
      }
      footer={<HaguFlowCta label={ctaLabel} onClick={onCta} disabled={ctaDisabled} />}
    >
      <div className="flex-1 pb-6">{children}</div>
      {footer}
    </ScreenLayout>
  )
}

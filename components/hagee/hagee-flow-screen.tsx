"use client"

import { cn } from "@/lib/utils"
import { PAGE_HAGEE_FLOW_HEADER_OFFSET } from "@/components/ui/page-shell"
import { ScreenLayout } from "@/components/ui/screen-layout"
import {
  SCREEN_FOOTER_SCROLL_PAD_COMPACT,
  SCREEN_FOOTER_SCROLL_PAD_PROGRESS,
  SCREEN_FOOTER_SCROLL_PAD_PROGRESS_NOTE,
  SCREEN_FOOTER_SCROLL_PAD_PROGRESS_TALL,
} from "@/components/ui/screen-footer"
import { HaguFlowCta } from "@/components/hagu/hagu-flow-cta"
import { HaguFlowHeader } from "@/components/hagu/hagu-flow-header"
import {
  HageeFlowProgressFooter,
  type FlowProgressSegments,
} from "./hagee-flow-progress-footer"
import { HageeFlowHeader } from "./hagee-flow-header"

/** @deprecated Use PAGE_HAGEE_FLOW_HEADER_OFFSET from screen-layout. */
export const HAGEE_FLOW_HEADER_OFFSET = PAGE_HAGEE_FLOW_HEADER_OFFSET

interface HageeFlowScreenProps {
  children: React.ReactNode
  onBack?: () => void
  /** Segmented progress + CTA combined in the pinned footer. */
  progressSegments?: FlowProgressSegments
  /** Optional text action below the CTA (e.g. Skip on intro). */
  secondaryAction?: { label: string; onClick: () => void }
  /** Static note below secondary action in progress footer (e.g. login link). */
  footerNote?: React.ReactNode
  ctaLabel: string
  onCta: () => void
  ctaDisabled?: boolean
  ctaVariant?: "primary" | "compact"
  footer?: React.ReactNode
  className?: string
}

export function HageeFlowScreen({
  children,
  onBack,
  progressSegments,
  secondaryAction,
  footerNote,
  ctaLabel,
  onCta,
  ctaDisabled,
  ctaVariant = "primary",
  footer,
  className,
}: HageeFlowScreenProps) {
  const hasFlowHeader = Boolean(onBack)
  const usesProgressFooter = Boolean(progressSegments)
  const isCompactCta = ctaVariant === "compact"

  const footerScrollPad = usesProgressFooter
    ? footerNote
      ? SCREEN_FOOTER_SCROLL_PAD_PROGRESS_NOTE
      : secondaryAction
        ? SCREEN_FOOTER_SCROLL_PAD_PROGRESS_TALL
        : SCREEN_FOOTER_SCROLL_PAD_PROGRESS
    : isCompactCta
      ? SCREEN_FOOTER_SCROLL_PAD_COMPACT
      : undefined

  const pinnedFooter = usesProgressFooter ? (
    <HageeFlowProgressFooter
      label={ctaLabel}
      onClick={onCta}
      disabled={ctaDisabled}
      segments={progressSegments!}
      secondaryAction={secondaryAction}
      footerNote={footerNote}
    />
  ) : (
    <HaguFlowCta label={ctaLabel} onClick={onCta} disabled={ctaDisabled} variant={ctaVariant} />
  )

  return (
    <ScreenLayout
      className={cn("bg-hagu-canvas text-hagu-ink", className)}
      contentPadding="px-7"
      headerClassName="bg-hagu-canvas px-7"
      reserveHeader
      headerVariant={hasFlowHeader ? "flowHagee" : "none"}
      footerScrollPad={footerScrollPad}
      header={
        hasFlowHeader ? (
          <HageeFlowHeader onBack={onBack!} />
        ) : (
          <div className="flex w-full items-center justify-center">
            <HaguFlowHeader className="hagu-brand-transition" />
          </div>
        )
      }
      footer={pinnedFooter}
    >
      <div className="flex-1 pb-6">{children}</div>
      {footer}
    </ScreenLayout>
  )
}

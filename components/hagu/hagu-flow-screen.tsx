"use client"

import type { ReactNode } from "react"
import { ScreenLayout } from "@/components/ui/screen-layout"
import {
  SCREEN_FOOTER_SCROLL_PAD_AUTH,
  SCREEN_FOOTER_SCROLL_PAD_LINK,
  SCREEN_FOOTER_SCROLL_PAD_PROGRESS,
  SCREEN_FOOTER_SCROLL_PAD_PROGRESS_NOTE,
  SCREEN_FOOTER_SCROLL_PAD_PROGRESS_TALL,
} from "@/components/ui/screen-footer"
import { HageeFlowHeader } from "@/components/hagee/hagee-flow-header"
import {
  HageeFlowProgressFooter,
  type FlowProgressSegments,
} from "@/components/hagee/hagee-flow-progress-footer"
import { HaguFlowCta } from "./hagu-flow-cta"
import { HaguFlowHeader } from "./hagu-flow-header"

interface HaguFlowScreenProps {
  children: React.ReactNode
  onBack?: () => void
  closeHref?: string | null
  showHeader?: boolean
  /** Minimal back-only header for onboarding; default glass chrome with brand + close. */
  headerVariant?: "glass" | "minimal"
  /** Segmented progress + CTA combined in the pinned footer. */
  progressSegments?: FlowProgressSegments
  /** Optional text action below the CTA in progress footer (e.g. Skip). */
  secondaryAction?: { label: string; onClick: () => void }
  /** Static note below CTA in progress footer (e.g. login link). */
  footerNote?: ReactNode
  ctaLabel: string
  onCta: () => void
  ctaDisabled?: boolean
  /** Extra content in the pinned footer below the CTA (e.g. OAuth providers). */
  pinnedFooterExtras?: React.ReactNode
  pinnedFooterSize?: "auth" | "link"
  /** Extra content at the bottom of the scroll body. */
  footer?: React.ReactNode
  className?: string
}

export function HaguFlowScreen({
  children,
  onBack,
  closeHref,
  showHeader = true,
  headerVariant = "glass",
  progressSegments,
  secondaryAction,
  footerNote,
  ctaLabel,
  onCta,
  ctaDisabled,
  pinnedFooterExtras,
  pinnedFooterSize = "auth",
  footer,
  className,
}: HaguFlowScreenProps) {
  const reserveHeader = showHeader
  const usesProgressFooter = Boolean(progressSegments)

  const footerScrollPad = usesProgressFooter
    ? footerNote
      ? SCREEN_FOOTER_SCROLL_PAD_PROGRESS_NOTE
      : secondaryAction
        ? SCREEN_FOOTER_SCROLL_PAD_PROGRESS_TALL
        : SCREEN_FOOTER_SCROLL_PAD_PROGRESS
    : pinnedFooterExtras
      ? pinnedFooterSize === "link"
        ? SCREEN_FOOTER_SCROLL_PAD_LINK
        : SCREEN_FOOTER_SCROLL_PAD_AUTH
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
    <HaguFlowCta
      label={ctaLabel}
      onClick={onCta}
      disabled={ctaDisabled}
      extras={pinnedFooterExtras}
      extrasSize={pinnedFooterSize}
    />
  )

  return (
    <ScreenLayout
      className={className}
      reserveHeader={reserveHeader}
      headerVariant="flowHagu"
      footerScrollPad={footerScrollPad}
      header={
        reserveHeader ? (
          headerVariant === "minimal" ? (
            <HageeFlowHeader onBack={onBack} />
          ) : (
            <HaguFlowHeader onBack={onBack} closeHref={closeHref} className="hagu-brand-transition" />
          )
        ) : undefined
      }
      footer={pinnedFooter}
    >
      <div className="flex-1 pb-6">{children}</div>
      {footer}
    </ScreenLayout>
  )
}

"use client"

import type { ReactNode } from "react"
import { HaguFlowHeader } from "@/components/hagu/hagu-flow-header"
import {
  PAGE_FIXED_HEADER_OFFSET,
  PAGE_HAGEE_FLOW_HEADER_OFFSET,
  PAGE_HEADER_TOP_PADDING,
  PageFixedHeader,
} from "@/components/ui/page-shell"
import { SCREEN_FOOTER_SCROLL_PAD } from "@/components/ui/screen-footer"
import { cn } from "@/lib/utils"

/** Safe area + gap above header chrome. */
export const SCREEN_SAFE_TOP = "calc(env(safe-area-inset-top, 2.75rem) + 0.5rem)" as const

/** Glass HAGU pill height. */
export const SCREEN_HEADER_BRAND_HEIGHT = "45px" as const

/** HAGEE back row + progress bar. */
export const SCREEN_HEADER_FLOW_HAGEE_HEIGHT = "4.75rem" as const

/** Body offset below fixed brand / HAGU flow header. */
export const SCREEN_BODY_OFFSET_BRAND = PAGE_FIXED_HEADER_OFFSET

/** Body offset below HAGEE flow header. */
export const SCREEN_BODY_OFFSET_FLOW_HAGEE = PAGE_HAGEE_FLOW_HEADER_OFFSET

export type ScreenHeaderVariant = "brand" | "flowHagu" | "flowHagee" | "none"

export function screenHeaderBodyOffset(variant: ScreenHeaderVariant): string {
  if (variant === "flowHagee") return SCREEN_BODY_OFFSET_FLOW_HAGEE
  return SCREEN_BODY_OFFSET_BRAND
}

/** Reserves brand header height without showing chrome (entry hero screens). */
export function BrandHeaderSpacer() {
  return (
    <header className="flex w-full justify-center" aria-hidden>
      <div className="h-[45px] w-[147px]" />
    </header>
  )
}

type ScreenLayoutProps = {
  children: ReactNode
  /** Header chrome — omit to show brand-only placeholder when `reserveHeader` is true. */
  header?: ReactNode
  headerVariant?: ScreenHeaderVariant
  /** Keep header slot height even when `header` is omitted (intro steps). */
  reserveHeader?: boolean
  footer?: ReactNode
  className?: string
  contentClassName?: string
  contentPadding?: string
  headerClassName?: string
}

/**
 * Three-zone screen grid: fixed header · scrollable body · pinned footer.
 * Use for auth, onboarding, and flow screens so CTA position stays stable.
 */
export function ScreenLayout({
  children,
  header,
  headerVariant = "brand",
  reserveHeader = true,
  footer,
  className,
  contentClassName,
  contentPadding = "px-6",
  headerClassName,
}: ScreenLayoutProps) {
  const showHeader = reserveHeader || Boolean(header)
  const bodyOffset = showHeader ? screenHeaderBodyOffset(headerVariant) : undefined

  const headerContent =
    header ??
    (reserveHeader ? <HaguFlowHeader className="hagu-brand-transition" /> : null)

  return (
    <main
      className={cn(
        "mx-auto flex min-h-dvh w-full max-w-md flex-col bg-[#FCFFFF] text-[#2D1012]",
        className,
      )}
    >
      {showHeader && headerContent ? (
        <PageFixedHeader className={headerClassName}>{headerContent}</PageFixedHeader>
      ) : null}

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-y-auto",
          contentPadding,
          bodyOffset,
          footer && SCREEN_FOOTER_SCROLL_PAD,
          contentClassName,
        )}
      >
        {children}
      </div>

      {footer}
    </main>
  )
}

export { PAGE_HEADER_TOP_PADDING }

"use client"

import * as React from "react"
import { ScreenFooter } from "@/components/ui/screen-footer"
import { cn } from "@/lib/utils"

type DivProps = React.HTMLAttributes<HTMLDivElement>

/** Shared top inset for every screen header (safe area + gap). */
export const PAGE_HEADER_TOP_PADDING = "pt-[calc(env(safe-area-inset-top,2.75rem)+0.5rem)]" as const

/** @see SCREEN_BODY_OFFSET_BRAND in screen-layout.tsx */
export const PAGE_FIXED_HEADER_OFFSET =
  "pt-[calc(env(safe-area-inset-top,2.75rem)+0.5rem+45px+0.75rem)]" as const

/** @see SCREEN_BODY_OFFSET_FLOW_HAGEE in screen-layout.tsx */
export const PAGE_HAGEE_FLOW_HEADER_OFFSET =
  "pt-[calc(env(safe-area-inset-top,2.75rem)+0.5rem+4.75rem)]" as const

/** Scroll offset below inline toolbar headers (edit profile, chat thread row). */
export const PAGE_TOOLBAR_HEADER_OFFSET = "pt-[calc(env(safe-area-inset-top,2.75rem)+0.5rem+2.75rem+0.75rem)]" as const

type PageContentProps = DivProps & {
  /** Reserve space for a PageFixedHeader so content scrolls underneath it. */
  underFixedHeader?: boolean
}

/**
 * Fixed glass header chrome — stays pinned while page content scrolls.
 * Use on every HAGU screen with HaguFlowHeader (tab screens, flow screens, settings).
 */
export function PageFixedHeader({ className, children, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-md px-6",
        PAGE_HEADER_TOP_PADDING,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function PageShell({ className, ...props }: DivProps) {
  return (
    <main
      className={cn("mx-auto flex min-h-dvh w-full max-w-md flex-col bg-[#FEFFFF] px-6 pb-8 pt-2", className)}
      {...props}
    />
  )
}

export function PageContent({ className, underFixedHeader, ...props }: PageContentProps) {
  return (
    <div
      className={cn("space-y-0 pb-24", underFixedHeader && PAGE_FIXED_HEADER_OFFSET, className)}
      {...props}
    />
  )
}

export function PageActions({ className, children }: { className?: string; children?: React.ReactNode }) {
  const [hideForKeyboard, setHideForKeyboard] = React.useState(false)

  React.useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    const baselineHeight = viewport.height

    const isTextInput = (el: Element | null) => {
      if (!(el instanceof HTMLElement)) return false
      if (el instanceof HTMLTextAreaElement) return true
      if (el instanceof HTMLInputElement) {
        const type = (el.type || "text").toLowerCase()
        return !["button", "submit", "reset", "checkbox", "radio", "file", "range", "color"].includes(type)
      }
      return el.isContentEditable
    }

    const updateVisibility = () => {
      const active = document.activeElement
      const keyboardLikelyOpen = baselineHeight - viewport.height > 120
      setHideForKeyboard(keyboardLikelyOpen && isTextInput(active))
    }

    viewport.addEventListener("resize", updateVisibility)
    window.addEventListener("focusin", updateVisibility)
    window.addEventListener("focusout", updateVisibility)
    updateVisibility()

    return () => {
      viewport.removeEventListener("resize", updateVisibility)
      window.removeEventListener("focusin", updateVisibility)
      window.removeEventListener("focusout", updateVisibility)
    }
  }, [])

  return (
    <ScreenFooter
      className={cn(
        "transition-all duration-200",
        hideForKeyboard && "pointer-events-none translate-y-full opacity-0",
      )}
      innerClassName={className}
    >
      {children}
    </ScreenFooter>
  )
}

/**
 * Bottom action zone — delegates to ScreenFooter (pinned, not sticky).
 * Parent shell must be `min-h-dvh` flex column (PageShell or ScreenLayout).
 */

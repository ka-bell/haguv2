"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type DivProps = React.HTMLAttributes<HTMLDivElement>

export function PageShell({ className, ...props }: DivProps) {
  return (
    <main
      className={cn("mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#FEFFFF] px-6 pb-8 pt-2", className)}
      {...props}
    />
  )
}

export function PageContent({ className, ...props }: DivProps) {
  return <div className={cn("space-y-0 pb-24", className)} {...props} />
}

export function PageActions({ className, ...props }: DivProps) {
  const { style, children, ...rest } = props
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
    <div
      className={cn(
        "sticky bottom-0 z-20 mt-auto -mx-6 border-t border-black/5 bg-[#FEFFFF]/95 px-6 pb-3 pt-4 backdrop-blur supports-[backdrop-filter]:bg-[#FEFFFF]/90 transition-all duration-200",
        hideForKeyboard && "pointer-events-none translate-y-full opacity-0",
      )}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
    >
      <div className={cn("mx-auto w-full max-w-md space-y-3", className)} style={style} {...rest}>
        {children}
      </div>
    </div>
  )
}

/**
 * CTA zones are sticky by default across app flows.
 * If a route must not use sticky actions, render custom actions outside PageActions.
 */

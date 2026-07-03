"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type AuthProviderButtonProps = {
  label: string
  icon: ReactNode
  onClick?: () => void
  className?: string
}

/** Shared shell for OAuth provider buttons — light, rounded-[20px], h-12. */
export function AuthProviderButton({ label, icon, onClick, className }: AuthProviderButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn("hagu-auth-btn", className)}
    >
      <span className="flex size-[18px] shrink-0 items-center justify-center">{icon}</span>
      <span>{label}</span>
    </button>
  )
}

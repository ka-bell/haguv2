"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getDefaultRouteForRole } from "@/lib/app-navigation"
import { isPrototypeMode } from "@/lib/prototype"
import { getSession } from "@/lib/session"

export function EntryGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    if (isPrototypeMode()) return

    const session = getSession()
    if (session.isLoggedIn && session.onboardingComplete) {
      router.replace(getDefaultRouteForRole(session.role))
    }
  }, [router])

  return <>{children}</>
}

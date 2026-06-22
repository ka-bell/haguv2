"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isPrototypeMode } from "@/lib/prototype"
import { ROUTES } from "@/lib/routes"
import { getSession } from "@/lib/session"

export function EntryGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    if (isPrototypeMode()) return

    const session = getSession()
    if (session.isLoggedIn && session.onboardingComplete) {
      router.replace(ROUTES.discover)
    }
  }, [router])

  return <>{children}</>
}

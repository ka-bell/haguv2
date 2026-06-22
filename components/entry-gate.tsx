"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/routes"
import { getSession } from "@/lib/session"

export function EntryGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const session = getSession()
    if (session.isLoggedIn && session.onboardingComplete) {
      router.replace(ROUTES.discover)
    }
  }, [router])

  return <>{children}</>
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppBottomNav } from "@/components/app-bottom-nav"
import { ROUTES } from "@/lib/routes"
import { getSession } from "@/lib/session"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (!session.isLoggedIn || !session.onboardingComplete) {
      router.replace(ROUTES.entry)
      return
    }
    setReady(true)
  }, [router])

  if (!ready) return null

  return (
    <>
      {children}
      <AppBottomNav />
    </>
  )
}

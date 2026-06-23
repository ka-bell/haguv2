"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AppBottomNav } from "@/components/app-bottom-nav"
import { isPrototypeMode } from "@/lib/prototype"
import { ROUTES } from "@/lib/routes"
import { getSession } from "@/lib/session"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (isPrototypeMode()) {
      setReady(true)
      return
    }

    const session = getSession()
    if (!session.isLoggedIn || !session.onboardingComplete) {
      setReady(false)
      router.replace(ROUTES.entry)
      return
    }
    setReady(true)
  }, [pathname, router])

  if (!ready) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center bg-[#FCFFFF]">
        <p className="text-sm text-[#8A8A96]">Loading…</p>
      </main>
    )
  }

  const hideBottomNav =
    pathname.startsWith(ROUTES.chat) || pathname.startsWith(ROUTES.reviews)

  return (
    <>
      {children}
      {!hideBottomNav ? <AppBottomNav /> : null}
    </>
  )
}

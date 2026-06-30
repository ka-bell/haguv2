"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/routes"

/** Legacy URL — profile lives at `/profile` for both roles. */
export default function SettingsRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace(ROUTES.profile)
  }, [router])

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md items-center justify-center bg-hagu-canvas">
      <p className="text-sm text-hagu-text-secondary">Loading…</p>
    </main>
  )
}

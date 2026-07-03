"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { HageeProfileScreen } from "@/components/hagee/hagee-profile-screen"
import { HageeTabShell } from "@/components/hagee/hagee-tab-shell"
import { isHaguProvider } from "@/lib/app-navigation"
import { ROUTES } from "@/lib/routes"
import { getSession, type UserRole } from "@/lib/session"

export default function ProfilePage() {
  const router = useRouter()
  const [role, setRole] = useState<UserRole | null | undefined>(undefined)

  useEffect(() => {
    setRole(getSession().role)
  }, [])

  useEffect(() => {
    if (role === undefined) return
    if (isHaguProvider(role)) {
      router.replace(ROUTES.settings)
    }
  }, [role, router])

  if (role === undefined) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md items-center justify-center bg-hagu-canvas">
        <p className="text-sm text-hagu-text-secondary">Loading…</p>
      </main>
    )
  }

  if (isHaguProvider(role)) {
    return null
  }

  return (
    <HageeTabShell>
      <HageeProfileScreen />
    </HageeTabShell>
  )
}

"use client"

import { useEffect, useState } from "react"
import { HaguSettingsScreen } from "@/components/hagu/hagu-settings-screen"
import { HaguProviderTabShell } from "@/components/hagu/hagu-provider-tab-shell"
import { HageeProfileScreen } from "@/components/hagee/hagee-profile-screen"
import { HageeTabShell } from "@/components/hagee/hagee-tab-shell"
import { isHaguProvider } from "@/lib/app-navigation"
import { getSession, type UserRole } from "@/lib/session"

export default function ProfilePage() {
  const [role, setRole] = useState<UserRole | null | undefined>(undefined)

  useEffect(() => {
    setRole(getSession().role)
  }, [])

  if (role === undefined) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md items-center justify-center bg-hagu-canvas">
        <p className="text-sm text-hagu-text-secondary">Loading…</p>
      </main>
    )
  }

  if (isHaguProvider(role)) {
    return (
      <HaguProviderTabShell>
        <HaguSettingsScreen />
      </HaguProviderTabShell>
    )
  }

  return (
    <HageeTabShell>
      <HageeProfileScreen />
    </HageeTabShell>
  )
}

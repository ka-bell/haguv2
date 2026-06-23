"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { HageeProfileScreen } from "@/components/hagee/hagee-profile-screen"
import { HageeTabShell } from "@/components/hagee/hagee-tab-shell"
import { ROUTES } from "@/lib/routes"
import { getSession } from "@/lib/session"

export default function ProfilePage() {
  const router = useRouter()
  const session = getSession()
  const isProvider = session.role === "HAGU"

  useEffect(() => {
    if (isProvider) {
      router.replace(ROUTES.settings)
    }
  }, [isProvider, router])

  if (isProvider) {
    return null
  }

  return (
    <HageeTabShell>
      <HageeProfileScreen />
    </HageeTabShell>
  )
}

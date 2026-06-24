"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { HageeExploreScreen } from "@/components/hagee/hagee-explore-screen"
import { HageeTabShell } from "@/components/hagee/hagee-tab-shell"
import { hasCompletedDiscoverRefine } from "@/lib/hagee-discover-preferences"
import { ROUTES } from "@/lib/routes"

export default function ExplorePage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!hasCompletedDiscoverRefine()) {
      router.replace(ROUTES.exploreRefine)
      return
    }

    setReady(true)
  }, [router])

  if (!ready) {
    return (
      <HageeTabShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm text-hagu-text-secondary">Loading…</p>
        </div>
      </HageeTabShell>
    )
  }

  return (
    <HageeTabShell>
      <HageeExploreScreen />
    </HageeTabShell>
  )
}

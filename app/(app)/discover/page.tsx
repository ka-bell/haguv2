"use client"

import { getSession } from "@/lib/session"
import { HaguProviderHome } from "@/components/hagu/hagu-provider-home"
import { HaguProviderTabShell } from "@/components/hagu/hagu-provider-tab-shell"
import { HageeTabShell } from "@/components/hagee/hagee-tab-shell"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"

export default function DiscoverPage() {
  const session = getSession()
  const isHaguProvider = session.role === "HAGU"

  if (isHaguProvider) {
    return (
      <HaguProviderTabShell>
        <HaguProviderHome />
      </HaguProviderTabShell>
    )
  }

  return (
    <HageeTabShell>
      <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">Discover</h1>
      <p className="mt-1 text-sm text-[#8A8A96]">Browse companions that match your vibe.</p>

      <div className="mt-8 space-y-4">
        <Card>
          <CardTitle>Luca M.</CardTitle>
          <CardDescription>Dinner dates, city walks, deep talks</CardDescription>
        </Card>
        <Card>
          <CardTitle>Sam K.</CardTitle>
          <CardDescription>Event buddy, coffee chats, spontaneous plans</CardDescription>
        </Card>
      </div>
    </HageeTabShell>
  )
}

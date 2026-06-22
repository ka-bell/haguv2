"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { HaguProviderTabShell } from "@/components/hagu/hagu-provider-tab-shell"
import { isPrototypeMode } from "@/lib/prototype"
import { ROUTES } from "@/lib/routes"
import { getSession, logout } from "@/lib/session"

export default function ProfilePage() {
  const router = useRouter()
  const session = getSession()
  const isProvider = session.role === "HAGU" || isPrototypeMode()

  const handleLogout = () => {
    logout()
    router.push(ROUTES.entry)
  }

  if (isProvider) {
    return (
      <HaguProviderTabShell>
        <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">Settings</h1>
        <p className="mt-1 text-sm text-[#8A8A96]">Account, payouts, and preferences.</p>

        <div className="mt-8 space-y-4">
          <Card>
            <CardTitle>Role</CardTitle>
            <CardDescription>{session.role ?? "HAGU (prototype)"}</CardDescription>
          </Card>
          <Card className="border-dashed border-black/15 bg-black/[0.02]">
            <CardTitle>Settings sections</CardTitle>
            <CardDescription>Cover, stats, payouts — see Figma node 2467:14188.</CardDescription>
          </Card>
        </div>

        <Button variant="outline" size="lg" className="mt-8 w-full" onClick={handleLogout}>
          Log out
        </Button>
      </HaguProviderTabShell>
    )
  }

  return (
    <HaguProviderTabShell>
      <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">Profile</h1>
      <p className="mt-1 text-sm text-[#8A8A96]">Your account and preferences.</p>

      <div className="mt-8 space-y-4">
        <Card>
          <CardTitle>Role</CardTitle>
          <CardDescription>{session.role ?? "Not set"}</CardDescription>
        </Card>
      </div>

      <Button variant="outline" size="lg" className="mt-8 w-full" onClick={handleLogout}>
        Log out
      </Button>
    </HaguProviderTabShell>
  )
}

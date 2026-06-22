"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { PageActions, PageContent, PageShell } from "@/components/ui/page-shell"
import { TopGlassHeader } from "@/components/ui/top-glass-header"
import { ROUTES } from "@/lib/routes"
import { getSession, logout } from "@/lib/session"

export default function ProfilePage() {
  const router = useRouter()
  const session = getSession()

  const handleLogout = () => {
    logout()
    router.push(ROUTES.entry)
  }

  return (
    <PageShell className="pb-28">
      <TopGlassHeader />
      <PageContent>
        <h1 className="mt-4 text-3xl font-semibold text-[#2D1012]">Profile</h1>
        <p className="mt-1 text-sm text-[#8a8a96]">Your account and preferences.</p>

        <div className="mt-8 space-y-4">
          <Card>
            <CardTitle>Role</CardTitle>
            <CardDescription>{session.role ?? "Not set"}</CardDescription>
          </Card>
          <Card>
            <CardTitle>Onboarding</CardTitle>
            <CardDescription>{session.onboardingComplete ? "Complete" : "Incomplete"}</CardDescription>
          </Card>
          <Card className="border-dashed border-black/15 bg-black/[0.02]">
            <CardTitle>Profile settings placeholder</CardTitle>
            <CardDescription>Edit profile, verification, and preferences will live here.</CardDescription>
          </Card>
        </div>
      </PageContent>

      <PageActions>
        <Button variant="outline" size="lg" className="w-full" onClick={handleLogout}>
          Log out
        </Button>
      </PageActions>
    </PageShell>
  )
}

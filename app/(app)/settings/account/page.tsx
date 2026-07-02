"use client"

import { useRouter } from "next/navigation"
import { AccountSettingsScreen } from "@/components/account/account-settings-screen"
import { HaguFlowPageShell } from "@/components/hagu/hagu-provider-tab-shell"
import { ROUTES } from "@/lib/routes"

export default function SettingsAccountPage() {
  const router = useRouter()

  return (
    <HaguFlowPageShell onBack={() => router.back()} closeHref={ROUTES.profile}>
      <AccountSettingsScreen />
    </HaguFlowPageShell>
  )
}

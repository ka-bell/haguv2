"use client"

import { useRouter } from "next/navigation"
import { HaguTransactionsScreen } from "@/components/hagu/hagu-transactions-screen"
import { HaguFlowPageShell } from "@/components/hagu/hagu-provider-tab-shell"
import { ROUTES } from "@/lib/routes"

export default function SettingsTransactionsPage() {
  const router = useRouter()

  return (
    <HaguFlowPageShell onBack={() => router.back()} closeHref={ROUTES.profile}>
      <HaguTransactionsScreen />
    </HaguFlowPageShell>
  )
}

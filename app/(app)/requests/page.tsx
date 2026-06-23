"use client"

import { useRouter } from "next/navigation"
import { HaguRequestsScreen } from "@/components/hagu/hagu-requests-screen"
import { HaguFlowPageShell } from "@/components/hagu/hagu-provider-tab-shell"
import { ROUTES } from "@/lib/routes"

export default function RequestsPage() {
  const router = useRouter()

  return (
    <HaguFlowPageShell onBack={() => router.push(ROUTES.discover)} closeHref={ROUTES.discover}>
      <HaguRequestsScreen />
    </HaguFlowPageShell>
  )
}

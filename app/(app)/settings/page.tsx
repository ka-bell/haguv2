"use client"

import { HaguSettingsScreen } from "@/components/hagu/hagu-settings-screen"
import { HaguFlowHeader } from "@/components/hagu/hagu-flow-header"
import { PageContent, PageFixedHeader, PageShell } from "@/components/ui/page-shell"

export default function SettingsPage() {
  return (
    <PageShell className="relative bg-[#FCFFFF] px-0 pb-28 pt-0">
      <PageFixedHeader>
        <HaguFlowHeader />
      </PageFixedHeader>
      <PageContent className="pb-0">
        <HaguSettingsScreen />
      </PageContent>
    </PageShell>
  )
}

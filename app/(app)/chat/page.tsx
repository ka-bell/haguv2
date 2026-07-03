"use client"

import { Suspense, useEffect, useState } from "react"
import { HaguMessagesScreen } from "@/components/hagu/hagu-messages-screen"
import { HageeConnectionsScreen } from "@/components/hagee/hagee-connections-screen"
import { isHaguProvider } from "@/lib/app-navigation"
import { getSession, type UserRole } from "@/lib/session"

function ConnectionsLoading() {
  return (
    <div className="mx-auto flex min-h-[50dvh] w-full max-w-md items-center justify-center bg-hagu-canvas px-5">
      <p className="text-sm text-hagu-text-secondary">Loading…</p>
    </div>
  )
}

function ChatPageContent() {
  const [role, setRole] = useState<UserRole | null | undefined>(undefined)

  useEffect(() => {
    setRole(getSession().role)
  }, [])

  if (role === undefined) {
    return <ConnectionsLoading />
  }

  if (isHaguProvider(role)) {
    return <HaguMessagesScreen />
  }

  return <HageeConnectionsScreen />
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ConnectionsLoading />}>
      <ChatPageContent />
    </Suspense>
  )
}

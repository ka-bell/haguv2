import { Suspense } from "react"
import { HageeConnectionsScreen } from "@/components/hagee/hagee-connections-screen"

function ConnectionsLoading() {
  return (
    <div className="mx-auto flex min-h-[50dvh] w-full max-w-md items-center justify-center bg-hagu-canvas px-5">
      <p className="text-sm text-hagu-text-secondary">Loading…</p>
    </div>
  )
}

/** HAGEE connections list — HAGU sessions are redirected to a provider thread by the app layout. */
export default function ChatPage() {
  return (
    <Suspense fallback={<ConnectionsLoading />}>
      <HageeConnectionsScreen />
    </Suspense>
  )
}

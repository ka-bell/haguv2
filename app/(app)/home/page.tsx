import { HageeHomeScreen } from "@/components/hagee/hagee-home-screen"
import { HageeTabShell } from "@/components/hagee/hagee-tab-shell"

/** HAGEE home dashboard — HAGU sessions are redirected to /discover by the app layout. */
export default function HomePage() {
  return (
    <HageeTabShell>
      <HageeHomeScreen />
    </HageeTabShell>
  )
}

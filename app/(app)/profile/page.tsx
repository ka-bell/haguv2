import { HageeProfileScreen } from "@/components/hagee/hagee-profile-screen"
import { HageeTabShell } from "@/components/hagee/hagee-tab-shell"

/** HAGEE profile — HAGU sessions are redirected to /settings by the app layout. */
export default function ProfilePage() {
  return (
    <HageeTabShell>
      <HageeProfileScreen />
    </HageeTabShell>
  )
}

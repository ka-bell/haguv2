import { HaguCalendarScreen } from "@/components/hagu/hagu-calendar-screen"
import { HaguProviderTabShell } from "@/components/hagu/hagu-provider-tab-shell"

export default function CalendarPage() {
  return (
    <HaguProviderTabShell>
      <HaguCalendarScreen />
    </HaguProviderTabShell>
  )
}

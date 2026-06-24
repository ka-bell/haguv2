import { HaguProviderHome } from "@/components/hagu/hagu-provider-home"
import { HaguProviderTabShell } from "@/components/hagu/hagu-provider-tab-shell"

/** HAGU provider home — HAGEE sessions are redirected to /explore by the app layout. */
export default function DiscoverPage() {
  return (
    <HaguProviderTabShell>
      <HaguProviderHome />
    </HaguProviderTabShell>
  )
}

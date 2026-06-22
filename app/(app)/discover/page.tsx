import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { PageContent, PageShell } from "@/components/ui/page-shell"
import { TopGlassHeader } from "@/components/ui/top-glass-header"

export default function DiscoverPage() {
  return (
    <PageShell className="pb-28">
      <TopGlassHeader />
      <PageContent>
        <h1 className="mt-4 text-3xl font-semibold text-[#2D1012]">Discover</h1>
        <p className="mt-1 text-sm text-[#8a8a96]">Browse companions that match your vibe.</p>

        <div className="mt-8 space-y-4">
          <Card>
            <CardTitle>Luca M.</CardTitle>
            <CardDescription>Dinner dates, city walks, deep talks</CardDescription>
          </Card>
          <Card>
            <CardTitle>Sam K.</CardTitle>
            <CardDescription>Event buddy, coffee chats, spontaneous plans</CardDescription>
          </Card>
          <Card className="border-dashed border-black/15 bg-black/[0.02]">
            <CardTitle>More profiles coming soon</CardTitle>
            <CardDescription>This screen is a placeholder while we wire the full flow.</CardDescription>
          </Card>
        </div>
      </PageContent>
    </PageShell>
  )
}

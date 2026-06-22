import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { PageContent, PageShell } from "@/components/ui/page-shell"
import { TopGlassHeader } from "@/components/ui/top-glass-header"

export default function BookingsPage() {
  return (
    <PageShell className="pb-28">
      <TopGlassHeader />
      <PageContent>
        <h1 className="mt-4 text-3xl font-semibold text-[#2D1012]">Bookings</h1>
        <p className="mt-1 text-sm text-[#8a8a96]">Upcoming and past companionship requests.</p>

        <div className="mt-8 space-y-4">
          <Card>
            <CardTitle>Dinner with Luca</CardTitle>
            <CardDescription>Tomorrow · 19:00 to 21:00 · Pending confirmation</CardDescription>
          </Card>
          <Card className="border-dashed border-black/15 bg-black/[0.02]">
            <CardTitle>No more bookings yet</CardTitle>
            <CardDescription>Booking management will be built in the next phase.</CardDescription>
          </Card>
        </div>
      </PageContent>
    </PageShell>
  )
}

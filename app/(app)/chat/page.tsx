import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { PageContent, PageShell } from "@/components/ui/page-shell"
import { TopGlassHeader } from "@/components/ui/top-glass-header"

export default function ChatPage() {
  return (
    <PageShell className="pb-28">
      <TopGlassHeader />
      <PageContent>
        <h1 className="mt-4 text-3xl font-semibold text-[#2D1012]">Chat</h1>
        <p className="mt-1 text-sm text-[#8a8a96]">Coordinate plans with your matches.</p>

        <div className="mt-8 space-y-4">
          <Card>
            <CardTitle>Luca M.</CardTitle>
            <CardDescription>Last message: Looking forward to tomorrow!</CardDescription>
          </Card>
          <Card className="border-dashed border-black/15 bg-black/[0.02]">
            <CardTitle>Chat inbox placeholder</CardTitle>
            <CardDescription>Thread list and messaging UI will land here next.</CardDescription>
          </Card>
        </div>
      </PageContent>
    </PageShell>
  )
}

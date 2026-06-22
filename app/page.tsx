import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EntryGate } from "@/components/entry-gate"
import { PageActions, PageContent, PageShell } from "@/components/ui/page-shell"

export default function EntryPage() {
  return (
    <EntryGate>
      <PageShell className="px-10 pb-16 pt-24">
        <PageContent className="text-center">
          <h1 className="text-5xl font-black tracking-tight text-[#2D1012]">HAGU</h1>
          <p className="mt-3 text-sm text-[#8a8a96]">The app for unconventional companionship.</p>
        </PageContent>

        <PageActions className="w-full">
          <Link href="/login" className="block">
            <Button size="lg" className="w-full">
              Log in
            </Button>
          </Link>
          <Link href="/select-role" className="block">
            <Button variant="outline" size="lg" className="w-full">
              Create account
            </Button>
          </Link>
        </PageActions>
      </PageShell>
    </EntryGate>
  )
}

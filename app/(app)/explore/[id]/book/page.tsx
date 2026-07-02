import { Suspense } from "react"
import { ScreenLayout } from "@/components/ui/screen-layout"
import { ExploreCompanionBookPageClient } from "./book-page-client"

function BookingPageLoading() {
  return (
    <ScreenLayout className="bg-hagu-canvas" reserveHeader headerVariant="brand">
      <div className="flex flex-1 items-center justify-center py-20">
        <p className="text-sm text-hagu-text-secondary">Loading…</p>
      </div>
    </ScreenLayout>
  )
}

export default function ExploreCompanionBookPage() {
  return (
    <Suspense fallback={<BookingPageLoading />}>
      <ExploreCompanionBookPageClient />
    </Suspense>
  )
}

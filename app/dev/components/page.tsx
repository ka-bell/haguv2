"use client"

import { Calendar, ChevronLeft, MessageCircle, Search, User, X } from "lucide-react"
import { useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { BottomGlassNavigation } from "@/components/ui/bottom-glass-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PageContent, PageShell } from "@/components/ui/page-shell"
import { SegmentedPillGroup } from "@/components/ui/segmented-pill-group"
import { Tag } from "@/components/ui/tag"
import { TopGlassHeader } from "@/components/ui/top-glass-header"

export default function ComponentsPage() {
  const [segments, setSegments] = useState<string[]>(["hosting"])

  return (
    <PageShell className="max-w-xl px-6 pb-16 pt-8 text-[#2D1012]">
      <PageContent className="mx-auto flex w-full max-w-xl flex-col gap-8">
        <section>
          <h1 className="text-2xl font-semibold">HAGU Component Library</h1>
          <p className="mt-1 text-sm text-[#8a8a96]">Base UI primitives and visual states for all HAGU flows.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8a8a96]">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8a8a96]">Inputs</h2>
          <Input label="Display name" defaultValue="Anouk V." />
          <Input label="Tagline" placeholder="e.g. Art lover & great listener" />
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8a8a96]">Cards</h2>
          <Card>
            <CardTitle>Dinner with Luca</CardTitle>
            <CardDescription>Tomorrow - 19:00 to 21:00</CardDescription>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8a8a96]">Avatar + Tags</h2>
          <div className="flex items-center gap-4">
            <Avatar fallback="SA" online />
            <Avatar size="sm" fallback="LM" />
            <Avatar size="lg" fallback="AV" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Tag>Night owl</Tag>
            <Tag variant="accent">Deep talk</Tag>
            <Tag variant="outlined">Dry humour</Tag>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8a8a96]">Segmented Pills</h2>
          <SegmentedPillGroup
            options={[
              { value: "hosting", label: "Hosting" },
              { value: "visiting", label: "Visiting" },
              { value: "public", label: "Public" },
            ]}
            value={segments}
            onChange={setSegments}
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8a8a96]">Top Glass Header</h2>
          <div className="rounded-[28px] border border-black/5 bg-[#FCFFFF] py-3">
            <TopGlassHeader leftSlot={<ChevronLeft className="size-4" />} rightSlot={<X className="size-4" />} />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8a8a96]">Bottom Glass Navigation</h2>
          <div className="relative rounded-[28px] border border-black/5 bg-[#FCFFFF] p-3">
            <BottomGlassNavigation
              fixed={false}
              activeKey="discover"
              items={[
                { key: "discover", label: "Discover", href: "/discover", icon: <Search className="size-4" /> },
                { key: "bookings", label: "Bookings", href: "/bookings", icon: <Calendar className="size-4" /> },
                { key: "chat", label: "Chat", href: "/chat", icon: <MessageCircle className="size-4" /> },
                { key: "profile", label: "Profile", href: "/profile", icon: <User className="size-4" /> },
              ]}
            />
          </div>
        </section>
      </PageContent>
    </PageShell>
  )
}

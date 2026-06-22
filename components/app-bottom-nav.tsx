"use client"

import { Calendar, MessageCircle, Search, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { BottomGlassNavigation } from "@/components/ui/bottom-glass-navigation"
import { APP_TABS, tabFromPathname } from "@/lib/routes"

const TAB_ICONS = {
  discover: <Search className="size-4" />,
  bookings: <Calendar className="size-4" />,
  chat: <MessageCircle className="size-4" />,
  profile: <User className="size-4" />,
} as const

export function AppBottomNav() {
  const pathname = usePathname()
  const activeKey = tabFromPathname(pathname)

  return (
    <BottomGlassNavigation
      activeKey={activeKey}
      items={APP_TABS.map((tab) => ({
        key: tab.key,
        label: tab.label,
        href: tab.href,
        icon: TAB_ICONS[tab.key],
      }))}
    />
  )
}

"use client"

import { Calendar, CalendarCheck, Home, MessageCircle, Search, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { BottomGlassNavigation } from "@/components/ui/bottom-glass-navigation"
import {
  APP_TABS,
  PROVIDER_TABS,
  providerTabFromPathname,
  tabFromPathname,
} from "@/lib/routes"
import { getSession } from "@/lib/session"

const HAGEE_ICONS = {
  discover: <Search className="size-4" />,
  bookings: <Calendar className="size-4" />,
  chat: <MessageCircle className="size-4" />,
  profile: <User className="size-4" />,
} as const

const PROVIDER_ICONS = {
  home: <Home className="size-4" />,
  bookings: <CalendarCheck className="size-4" />,
  calendar: <Calendar className="size-4" />,
  settings: <User className="size-4" />,
} as const

export function AppBottomNav() {
  const pathname = usePathname()
  const session = getSession()
  const isProvider = session.role === "HAGU"

  if (isProvider) {
    const activeKey = providerTabFromPathname(pathname)
    return (
      <BottomGlassNavigation
        activeKey={activeKey}
        items={PROVIDER_TABS.map((tab) => ({
          key: tab.key,
          label: tab.label,
          href: tab.href,
          icon: PROVIDER_ICONS[tab.key],
        }))}
      />
    )
  }

  const activeKey = tabFromPathname(pathname)
  return (
    <BottomGlassNavigation
      activeKey={activeKey}
      items={APP_TABS.map((tab) => ({
        key: tab.key,
        label: tab.label,
        href: tab.href,
        icon: HAGEE_ICONS[tab.key],
      }))}
    />
  )
}

"use client"

import { Calendar, CalendarCheck, Home, MessageCircle, Search, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { BottomGlassNavigation } from "@/components/ui/bottom-glass-navigation"
import { getBottomNavConfig, type NavIconKey } from "@/lib/app-navigation"
import { getSession } from "@/lib/session"

const NAV_ICONS: Record<NavIconKey, React.ReactNode> = {
  home: <Home className="size-4" />,
  search: <Search className="size-4" />,
  message: <MessageCircle className="size-4" />,
  user: <User className="size-4" />,
  bookings: <CalendarCheck className="size-4" />,
  calendar: <Calendar className="size-4" />,
}

export function AppBottomNav() {
  const pathname = usePathname()
  const session = getSession()
  const { tabs, activeTabFromPathname } = getBottomNavConfig(session.role)
  const activeKey = activeTabFromPathname(pathname)

  return (
    <BottomGlassNavigation
      activeKey={activeKey}
      items={tabs.map((tab) => ({
        key: tab.key,
        label: tab.label,
        href: tab.href,
        icon: NAV_ICONS[tab.icon],
      }))}
    />
  )
}

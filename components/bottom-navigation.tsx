"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Heart, MessageCircle, Calendar, User } from "lucide-react"
import { useBookings } from "../lib/bookings-context"

export function BottomNavigation() {
  const pathname = usePathname()
  const { bookings, hasViewedBookings } = useBookings()

  const pendingBookings = bookings.filter((booking) => booking.status === "pending").length
  const showBookingsBadge = pendingBookings > 0 && !hasViewedBookings

  const navItems = [
    {
      name: "Explore",
      href: "/",
      icon: Search,
      isActive: pathname === "/",
    },
    {
      name: "Favorites",
      href: "/favorites",
      icon: Heart,
      isActive: pathname === "/favorites",
    },
    {
      name: "Chat",
      href: "/chat",
      icon: MessageCircle,
      isActive: pathname === "/chat",
      badge: "1",
    },
    {
      name: "Bookings",
      href: "/bookings",
      icon: Calendar,
      isActive: pathname.startsWith("/bookings"),
      badge: showBookingsBadge ? pendingBookings.toString() : undefined,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      isActive: pathname === "/profile",
      badge: "1",
    },
  ]

  return (
    <div className="fixed md:absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent px-4 pb-10 pt-10">
      <div className="flex justify-between items-start max-w-md mx-auto gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center flex-1 min-w-0">
              <div className="relative bg-white rounded-full w-14 h-14 flex flex-col items-center justify-center shadow-lg py-1.5">
                <Icon
                  className={`w-5 h-5 ${item.isActive ? "text-hagu-heading" : "text-hagu-text"}`}
                  strokeWidth={item.isActive ? 2.5 : 2}
                />
                <span
                  className={`text-[8px] leading-tight mt-0.5 ${item.isActive ? "text-hagu-heading font-medium" : "text-hagu-text"} truncate max-w-full text-center`}
                >
                  {item.name}
                </span>
                {item.badge && (
                  <div className="absolute -top-1 -right-1 bg-hagu-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {item.badge}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
      <div className="w-32 h-1 bg-gray-400 rounded-full mx-auto mt-4" />
    </div>
  )
}

export default BottomNavigation

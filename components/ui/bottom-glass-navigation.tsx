"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

export interface BottomNavItem {
  key: string
  label: string
  icon: React.ReactNode
  href: string
}

interface BottomGlassNavigationProps {
  items: BottomNavItem[]
  activeKey: string
  fixed?: boolean
  className?: string
}

export function BottomGlassNavigation({ items, activeKey, fixed = true, className }: BottomGlassNavigationProps) {
  return (
    <nav
      className={cn(
        fixed ? "fixed left-1/2 z-50 w-[min(340px,calc(100%-2rem))] -translate-x-1/2" : "relative z-10 w-full",
        className,
      )}
      style={fixed ? { bottom: "var(--hagu-tab-nav-bottom)" } : undefined}
    >
      <div
        className={cn(
          "relative flex h-16 items-center rounded-[32px] border border-black/[0.06] bg-white/80 backdrop-blur-2xl shadow-[0px_20px_40px_-10px_rgba(26,26,30,0.08)]",
          items.length > 4 ? "justify-around px-4" : "justify-between px-8",
        )}
      >
        {items.map((item) => {
          const active = item.key === activeKey
          return (
            <Link key={item.key} href={item.href} className="flex min-w-0 flex-1 flex-col items-center gap-1 px-0.5">
              <span className={cn("text-[#2D1012]", !active && "opacity-35")}>{item.icon}</span>
              <span
                className={cn(
                  "max-w-full truncate text-center font-medium",
                  items.length > 4 ? "text-[9px]" : "text-[10px]",
                  active ? "text-[#2D1012]" : "text-[#8a8a96]",
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

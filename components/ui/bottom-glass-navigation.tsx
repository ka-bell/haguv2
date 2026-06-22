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
      style={fixed ? { bottom: "max(1rem, env(safe-area-inset-bottom))" } : undefined}
    >
      <div className="relative flex h-16 items-center justify-between rounded-[32px] border border-[#D0F1F0]/50 bg-white/80 px-8 backdrop-blur-2xl shadow-[0px_20px_40px_-10px_rgba(45,16,18,0.1)]">
        {items.map((item) => {
          const active = item.key === activeKey
          return (
            <Link key={item.key} href={item.href} className="flex min-w-0 flex-col items-center gap-1">
              <span className={cn("text-[#2D1012]", !active && "opacity-35")}>{item.icon}</span>
              <span className={cn("text-[10px] font-medium", active ? "text-[#2D1012]" : "text-[#8a8a96]")}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

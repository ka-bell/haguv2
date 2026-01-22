"use client"

import type React from "react"

export function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="hidden md:flex min-h-screen items-center justify-center bg-gray-100 p-8">
        <div className="relative w-[375px] h-[812px] bg-black rounded-[3rem] shadow-2xl p-3">
          {/* iPhone notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-50" />

          {/* iPhone screen */}
          <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">{children}</div>
        </div>
      </div>

      <div className="md:hidden min-h-screen">{children}</div>
    </>
  )
}

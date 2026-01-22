import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { BookingsProvider } from "../lib/bookings-context"
import { FavoritesProvider } from "../lib/favorites-context"
import { BottomNavigation } from "../components/bottom-navigation"
import { MobileFrame } from "../components/mobile-frame"

export const metadata: Metadata = {
  title: "HAGU",
  description: "Find your perfect HAGU companion",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="font-sans">
        <FavoritesProvider>
          <BookingsProvider>
            <MobileFrame>
              <div className="pb-20">{children}</div>
              <BottomNavigation />
            </MobileFrame>
          </BookingsProvider>
        </FavoritesProvider>
      </body>
    </html>
  )
}

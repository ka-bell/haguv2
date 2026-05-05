import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "HAGU",
  description: "Paid companionship platform - calm, safe, premium",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="font-sans bg-[#FEFFFF] text-[#2D1012]">{children}</body>
    </html>
  )
}

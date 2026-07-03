import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hagutheapp.com"),
  title: "HAGU | The app for unconventional companionship.",
  description:
    "With society becoming more individualistic, people are longing for other physical connections. A hug, back-scratching session, a movie night, and more.",
  openGraph: {
    title: "HAGU | The app for unconventional companionship.",
    description:
      "With society becoming more individualistic, people are longing for other physical connections. A hug, back-scratching session, a movie night, and more.",
    siteName: "HAGU",
    type: "website",
    url: "https://www.hagutheapp.com",
  },
  twitter: {
    card: "summary",
    title: "HAGU | The app for unconventional companionship.",
    description:
      "With society becoming more individualistic, people are longing for other physical connections. A hug, back-scratching session, a movie night, and more.",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="overflow-x-hidden font-sans bg-[#FEFFFF] text-[#2D1012]">{children}</body>
    </html>
  )
}

"use client"

import { User, CreditCard, Lock, Calendar } from "lucide-react"
import Link from "next/link"
import { useBookings } from "@/lib/bookings-context"

export default function ProfilePage() {
  const { bookings } = useBookings()
  const pendingBookings = bookings.filter((booking) => booking.status === "pending").length

  return (
    <div className="min-h-screen bg-hagu-bg-light flex flex-col max-w-sm mx-auto">
      {/* Profile Header */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-hagu-border flex items-center justify-center bg-hagu-white">
            <User className="w-8 h-8 text-hagu-text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-hagu-heading">Sam B. 23</h1>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="px-6 mb-8">
        <h2 className="text-2xl font-bold text-hagu-heading mb-6">Settings</h2>

        <div className="space-y-0">
          <Link
            href="/profile/account"
            className="flex items-center gap-4 py-4 border-b border-hagu-border hover:bg-hagu-white/50 transition-colors rounded-lg px-2 -mx-2"
          >
            <User className="w-6 h-6 text-hagu-text" />
            <span className="text-lg text-hagu-text font-medium">Account details</span>
          </Link>

          <Link
            href="/profile/edit"
            className="flex items-center gap-4 py-4 border-b border-hagu-border hover:bg-hagu-white/50 transition-colors rounded-lg px-2 -mx-2"
          >
            <User className="w-6 h-6 text-hagu-text" />
            <span className="text-lg text-hagu-text font-medium">Edit profile</span>
          </Link>

          <Link
            href="/profile/billing"
            className="flex items-center gap-4 py-4 border-b border-hagu-border hover:bg-hagu-white/50 transition-colors rounded-lg px-2 -mx-2"
          >
            <CreditCard className="w-6 h-6 text-hagu-text" />
            <span className="text-lg text-hagu-text font-medium">Billing details</span>
          </Link>

          <Link
            href="/bookings"
            className="flex items-center gap-4 py-4 border-b border-hagu-border hover:bg-hagu-white/50 transition-colors rounded-lg px-2 -mx-2"
          >
            <Calendar className="w-6 h-6 text-hagu-text" />
            <span className="text-lg text-hagu-text font-medium">My Bookings</span>
          </Link>

          <Link
            href="/profile/security"
            className="flex items-center gap-4 py-4 border-b border-hagu-border hover:bg-hagu-white/50 transition-colors rounded-lg px-2 -mx-2"
          >
            <Lock className="w-6 h-6 text-hagu-text" />
            <span className="text-lg text-hagu-text font-medium">Log in & Security</span>
          </Link>
        </div>
      </div>

      {/* Guidelines Section */}
      <div className="px-6 mb-8">
        <h2 className="text-2xl font-bold text-hagu-heading mb-6">Guidelines</h2>

        <div className="space-y-0">
          <Link
            href="/profile/code-of-conduct"
            className="flex items-center gap-4 py-4 border-b border-hagu-border hover:bg-hagu-white/50 transition-colors rounded-lg px-2 -mx-2"
          >
            <Lock className="w-6 h-6 text-hagu-text" />
            <span className="text-lg text-hagu-text font-medium">Code of Conduct</span>
          </Link>

          <Link
            href="/profile/experiences"
            className="flex items-center gap-4 py-4 border-b border-hagu-border hover:bg-hagu-white/50 transition-colors rounded-lg px-2 -mx-2"
          >
            <Lock className="w-6 h-6 text-hagu-text" />
            <span className="text-lg text-hagu-text font-medium">Experiences</span>
          </Link>
        </div>
      </div>

      {/* About Section */}
      <div className="px-6 mb-8">
        <h2 className="text-2xl font-bold text-hagu-heading mb-6">About</h2>

        <div className="space-y-0">
          <Link
            href="/profile/who-we-are"
            className="flex items-center gap-4 py-4 border-b border-hagu-border hover:bg-hagu-white/50 transition-colors rounded-lg px-2 -mx-2"
          >
            <Lock className="w-6 h-6 text-hagu-text" />
            <span className="text-lg text-hagu-text font-medium">Who we are</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

"use client"

import { ChevronLeft, MessageCircle, X, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function BookingDetailPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-[#000000]" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#d8d8d8] rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-[#828282] rounded-full"></div>
          </div>
          <h1 className="text-xl font-semibold text-[#000000]">Linda L.</h1>
        </div>

        <div className="w-10"></div>
      </div>

      {/* Image Placeholder */}
      <div className="bg-[#d8d8d8] h-64 mx-6 rounded-lg mb-8 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-end justify-center">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            <polygon points="0,200 150,50 250,100 400,200" fill="#bdbdbd" />
            <polygon points="100,200 200,80 300,120 400,200" fill="#a8a8a8" />
            <circle cx="80" cy="60" r="25" fill="#bdbdbd" />
          </svg>
        </div>
      </div>

      {/* Booking Details */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-medium text-[#000000] mb-2">01.02.2023 14:00 - 15:30</h2>
        <p className="text-[#828282] text-base">Booking confirmed</p>
      </div>

      {/* Pay Button */}
      <div className="px-6 mb-8">
        <button className="w-full bg-[#828282] text-white py-4 rounded-lg text-lg font-medium">Pay</button>
      </div>

      {/* Action Items */}
      <div className="px-6 space-y-4 mb-8">
        <button className="flex items-center gap-4 w-full py-4 border-b border-[#d8d8d8]">
          <MessageCircle className="w-6 h-6 text-[#000000]" />
          <span className="text-[#000000] text-lg">Chat with Hagu</span>
        </button>

        <button className="flex items-center gap-4 w-full py-4 border-b border-[#d8d8d8]">
          <div className="w-6 h-6 flex items-center justify-center">
            <X className="w-5 h-5 text-[#000000]" />
          </div>
          <span className="text-[#000000] text-lg">Cancellation</span>
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Bottom Navigation */}
      <div className="bg-[#f2f2f2] px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 rounded-full border-2 border-[#828282]"></div>
            <span className="text-xs text-[#828282]">Explore</span>
          </Link>

          <Link href="/favorites" className="flex flex-col items-center gap-1">
            <Heart className="w-6 h-6 text-[#828282]" />
            <span className="text-xs text-[#828282]">Favorites</span>
          </Link>

          <button className="flex flex-col items-center gap-1 relative">
            <MessageCircle className="w-6 h-6 text-[#828282]" />
            <span className="text-xs text-[#828282]">Chat</span>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff3c3c] rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">1</span>
            </div>
          </button>

          <Link href="/bookings" className="flex flex-col items-center gap-1 relative">
            <div className="w-6 h-6 bg-[#2f80ed] rounded-sm"></div>
            <span className="text-xs text-[#2f80ed] font-medium">Bookings</span>
          </Link>

          <Link href="/profile" className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 rounded-full border-2 border-[#828282]"></div>
            <span className="text-xs text-[#828282]">Profile</span>
          </Link>
        </div>

        <div className="w-32 h-1 bg-[#000000] rounded-full mx-auto mt-4"></div>
      </div>
    </div>
  )
}

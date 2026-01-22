"use client"

import type React from "react"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useBookings } from "../../lib/bookings-context"

export default function BookingsPage() {
  const { bookings, hasNewBookings, markBookingsAsViewed } = useBookings()
  const router = useRouter()

  useEffect(() => {
    if (hasNewBookings) {
      markBookingsAsViewed()
    }
  }, [hasNewBookings, markBookingsAsViewed])

  const currentBookings = bookings.filter(
    (booking) => booking.status !== "Booking cancelled" && booking.status !== "Previous booking",
  )

  const historyBookings = [
    {
      id: 5,
      name: "Sam B.",
      age: 23,
      status: "Booking cancelled",
    },
    {
      id: 6,
      name: "Name L.",
      age: 34,
      status: "Previous booking",
    },
    {
      id: 7,
      name: "Name L.",
      age: 42,
      status: "Previous booking",
    },
  ]

  const handlePayClick = (e: React.MouseEvent, bookingId: number) => {
    e.stopPropagation()
    router.push(`/bookings/${bookingId}/payment`)
  }

  return (
    <div className="min-h-screen bg-hagu-bg-light flex flex-col max-w-sm mx-auto">
      <div className="text-center py-6">
        <h1 className="text-hagu-heading text-2xl font-bold">Bookings</h1>
      </div>

      {/* Current Bookings */}
      <div className="flex-1 px-6 pb-6">
        <div className="space-y-4">
          {currentBookings.map((booking) => (
            <Link key={booking.id} href={`/bookings/${booking.id}`} className="block">
              <div className="flex items-center justify-between py-4 border-b border-hagu-border hover:bg-white/50 transition-colors rounded-lg px-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-hagu-border flex items-center justify-center bg-hagu-white">
                    <svg className="w-6 h-6 text-hagu-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-hagu-heading font-bold text-lg">{booking.name}</span>
                      <span className="text-hagu-text-secondary text-lg">{booking.age}</span>
                    </div>
                    <p className="text-hagu-text-secondary text-sm font-medium">{booking.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {booking.needsPayment && (
                    <button
                      onClick={(e) => handlePayClick(e, booking.id)}
                      className="bg-hagu-primary text-hagu-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-hagu-primary/90 transition-colors"
                    >
                      Pay
                    </button>
                  )}
                  <svg
                    className="w-5 h-5 text-hagu-text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* History Section */}
        <div className="mt-12">
          <h2 className="text-hagu-heading text-2xl font-bold mb-6">History</h2>
          <div className="space-y-4">
            {historyBookings.map((booking) => (
              <Link key={booking.id} href={`/bookings/${booking.id}`} className="block">
                <div className="flex items-center justify-between py-4 border-b border-hagu-border hover:bg-white/50 transition-colors rounded-lg px-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-hagu-border flex items-center justify-center bg-hagu-white">
                      <svg className="w-6 h-6 text-hagu-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-hagu-heading font-bold text-lg">{booking.name}</span>
                        <span className="text-hagu-text-secondary text-lg">{booking.age}</span>
                      </div>
                      <p className="text-hagu-text-secondary text-sm font-medium">{booking.status}</p>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-hagu-text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

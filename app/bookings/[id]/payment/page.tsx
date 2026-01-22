"use client"

import { useState } from "react"
import { ChevronLeft, ChevronDown, X, Calendar } from "lucide-react"
import Link from "next/link"

export default function PaymentPage() {
  const [message, setMessage] = useState("")
  const [extraCosts, setExtraCosts] = useState("0,00")
  const [paymentMethod, setPaymentMethod] = useState("iDEAL")
  const [showConfirmation, setShowConfirmation] = useState(false)

  const subtotal = 90
  const serviceFee = 8
  const total = subtotal + serviceFee

  const handlePayment = () => {
    setShowConfirmation(true)
  }

  const closeConfirmation = () => {
    setShowConfirmation(false)
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#ffffff]">
        <button className="p-2">
          <ChevronLeft className="w-6 h-6 text-[#000000]" />
        </button>
        <h1 className="text-xl font-semibold text-[#000000]">Confirm & pay</h1>
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 bg-[#ffffff]">
        {/* Message Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-[#000000] mb-3">Message</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type here..."
            className="w-full h-32 p-4 border border-[#d8d8d8] rounded-lg text-[#000000] placeholder-[#828282] resize-none focus:outline-none focus:border-[#4f4f4f]"
          />
        </div>

        {/* Extra Costs Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-[#000000] mb-3">Extra costs (optional)</h2>
          <input
            type="text"
            value={extraCosts}
            onChange={(e) => setExtraCosts(e.target.value)}
            className="w-full p-4 border border-[#d8d8d8] rounded-lg text-[#000000] focus:outline-none focus:border-[#4f4f4f]"
          />
        </div>

        {/* Price Details Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#000000] mb-4">Price details</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#4f4f4f]">Subtotal</span>
              <span className="text-[#000000] font-medium">€{subtotal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#4f4f4f]">Service fee</span>
              <span className="text-[#000000] font-medium">€{serviceFee}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#d8d8d8]">
              <span className="text-[#000000] font-semibold">Total</span>
              <span className="text-[#000000] font-semibold">€{total}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#000000] mb-4">Payment method</h2>
          <div className="relative">
            <button className="w-full p-4 border border-[#d8d8d8] rounded-lg flex items-center justify-between bg-[#ffffff]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-6 bg-[#ff1744] rounded flex items-center justify-center">
                  <span className="text-[#ffffff] text-xs font-bold">iDEAL</span>
                </div>
                <span className="text-[#000000] font-medium">iDEAL</span>
              </div>
              <ChevronDown className="w-5 h-5 text-[#828282]" />
            </button>
          </div>
        </div>
      </div>

      {/* Pay Button */}
      <div className="p-6 bg-[#ffffff]">
        <button
          onClick={handlePayment}
          className="w-full py-4 bg-[#828282] text-[#ffffff] text-lg font-medium rounded-lg"
        >
          Pay
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around items-center py-4 bg-[#d8d8d8] border-t border-[#bdbdbd]">
        <Link href="/" className="flex flex-col items-center">
          <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#828282" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" stroke="#828282" strokeWidth="2" />
          </svg>
          <span className="text-xs text-[#828282]">Explore</span>
        </Link>
        <Link href="/favorites" className="flex flex-col items-center">
          <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none">
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              stroke="#828282"
              strokeWidth="2"
            />
          </svg>
          <span className="text-xs text-[#828282]">Favorites</span>
        </Link>
        <div className="flex flex-col items-center relative">
          <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-xs text-[#828282]">Chat</span>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff3c3c] rounded-full flex items-center justify-center">
            <span className="text-[#ffffff] text-xs font-bold">1</span>
          </div>
        </div>
        <Link href="/bookings" className="flex flex-col items-center">
          <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="#2f80ed">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#2f80ed" strokeWidth="2" fill="#2f80ed" />
            <line x1="16" y1="2" x2="16" y2="6" stroke="#ffffff" strokeWidth="2" />
            <line x1="8" y1="2" x2="8" y2="6" stroke="#ffffff" strokeWidth="2" />
            <line x1="3" y1="10" x2="21" y2="10" stroke="#ffffff" strokeWidth="2" />
          </svg>
          <span className="text-xs text-[#2f80ed] font-medium">Bookings</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center relative">
          <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#828282" strokeWidth="2" />
            <circle cx="12" cy="7" r="4" stroke="#828282" strokeWidth="2" />
          </svg>
          <span className="text-xs text-[#828282]">Profile</span>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#2f80ed] rounded-full flex items-center justify-center">
            <span className="text-[#ffffff] text-xs font-bold">1</span>
          </div>
        </Link>
      </div>

      {/* Home Indicator */}
      <div className="flex justify-center py-2 bg-[#d8d8d8]">
        <div className="w-32 h-1 bg-[#000000] rounded-full"></div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#ffffff] rounded-2xl w-full max-w-sm mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#d8d8d8]">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-[#000000]" />
                <h2 className="text-xl font-semibold text-[#000000]">Booking confirmed</h2>
              </div>
              <button onClick={closeConfirmation} className="p-1">
                <X className="w-6 h-6 text-[#000000]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <p className="text-[#828282] text-base leading-relaxed">
                Get in touch with the Hagu to discuss further details.
              </p>
              <p className="text-[#828282] text-base leading-relaxed">You can review your booking under Bookings.</p>
            </div>

            {/* Thanks Button */}
            <div className="p-6 pt-0">
              <button
                onClick={closeConfirmation}
                className="w-full py-4 bg-[#828282] text-[#ffffff] text-lg font-medium rounded-lg"
              >
                Thanks
              </button>
            </div>

            {/* Modal Home Indicator */}
            <div className="flex justify-center py-2">
              <div className="w-32 h-1 bg-[#828282] rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

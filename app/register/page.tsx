"use client"

import { useState } from "react"
import { X } from "lucide-react"
import Link from "next/link"
import { useBookings } from "@/lib/bookings-context"

export default function RegisterPage() {
  const { bookings } = useBookings()
  const [formData, setFormData] = useState({
    firstName: "karissa",
    lastName: "Bell",
    birthdate: "",
    email: "",
    phoneCountry: "+31",
    phoneNumber: "624587632",
    referralCode: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const pendingBookingsCount = bookings.filter((booking) => booking.status === "pending").length

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        {/* Left side - Hero section */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <div
            className="w-full h-full bg-cover bg-center relative"
            style={{
              backgroundImage: `url('/people-pets-park-blurred.png')`,
            }}
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-12">
              <h1 className="text-6xl font-bold mb-8 text-hagu-accent">Your details</h1>
              <div className="text-center text-lg leading-relaxed max-w-md">
                <p className="mb-4">
                  Safety is of the utmost importance for us. That's why we screen all of our Hagu's. We check if you are
                  a real person and what's your intention to become a Hagu.
                </p>
                <p>We kindly ask you to fill in the forms. Sorry, we know it's a bit of a hustle.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form section */}
        <div className="w-full lg:w-1/2 bg-hagu-white flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-hagu-border">
            <h2 className="text-2xl font-bold text-hagu-heading">HAGU</h2>
            <div className="flex items-center gap-4">
              {bookings.length > 0 && (
                <Link
                  href="/bookings"
                  className="flex items-center gap-2 px-3 py-2 bg-hagu-accent text-hagu-primary rounded-lg text-sm font-medium hover:bg-hagu-accent/80 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  My Bookings ({bookings.length})
                </Link>
              )}
              <Link href="/" className="p-2">
                <X className="w-6 h-6 text-hagu-text" />
              </Link>
            </div>
          </div>

          {/* Form content */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-md mx-auto">
              <h3 className="text-3xl font-bold text-hagu-heading mb-8">
                General
                <br />
                Information
              </h3>

              <div className="space-y-6">
                {/* First name */}
                <div>
                  <label className="block text-sm font-medium text-hagu-text mb-2">First name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="w-full px-4 py-3 border border-hagu-border rounded-lg focus:outline-none focus:ring-2 focus:ring-hagu-accent focus:border-transparent"
                  />
                </div>

                {/* Last name */}
                <div>
                  <label className="block text-sm font-medium text-hagu-text mb-2">Last name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="w-full px-4 py-3 border border-hagu-border rounded-lg focus:outline-none focus:ring-2 focus:ring-hagu-accent focus:border-transparent"
                  />
                </div>

                {/* Birthdate */}
                <div>
                  <label className="block text-sm font-medium text-hagu-text mb-2">Birthdate</label>
                  <input
                    type="text"
                    placeholder="xx/xx/xxxx"
                    value={formData.birthdate}
                    onChange={(e) => handleInputChange("birthdate", e.target.value)}
                    className="w-full px-4 py-3 border border-hagu-border rounded-lg focus:outline-none focus:ring-2 focus:ring-hagu-accent focus:border-transparent text-hagu-text-secondary"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-hagu-text mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="Fill in your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-3 border border-hagu-border rounded-lg focus:outline-none focus:ring-2 focus:ring-hagu-accent focus:border-transparent text-hagu-text-secondary"
                  />
                </div>

                {/* Phone number */}
                <div>
                  <label className="block text-sm font-medium text-hagu-text mb-2">Phone number</label>
                  <div className="flex gap-2">
                    <select
                      value={formData.phoneCountry}
                      onChange={(e) => handleInputChange("phoneCountry", e.target.value)}
                      className="px-4 py-3 border border-hagu-border rounded-lg focus:outline-none focus:ring-2 focus:ring-hagu-accent focus:border-transparent bg-hagu-white"
                    >
                      <option value="+31">+31</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+49">+49</option>
                    </select>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className="flex-1 px-4 py-3 border border-hagu-border rounded-lg focus:outline-none focus:ring-2 focus:ring-hagu-accent focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Referral Code Section */}
              <div className="mt-12">
                <h3 className="text-3xl font-bold text-hagu-heading mb-6">
                  Referral
                  <br />
                  Code
                </h3>

                <div>
                  <label className="block text-sm font-medium text-hagu-text mb-2">Referral code</label>
                  <input
                    type="text"
                    placeholder="Fill in the referral code starting with #"
                    value={formData.referralCode}
                    onChange={(e) => handleInputChange("referralCode", e.target.value)}
                    className="w-full px-4 py-3 border border-hagu-border rounded-lg focus:outline-none focus:ring-2 focus:ring-hagu-accent focus:border-transparent text-hagu-text-secondary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="p-8 border-t border-hagu-border">
            <div className="max-w-md mx-auto flex gap-4">
              <button className="flex-1 py-4 px-6 border border-hagu-border rounded-lg text-hagu-text font-medium hover:bg-hagu-bg-light transition-colors">
                Back
              </button>
              <button className="flex-1 py-4 px-6 bg-hagu-primary text-hagu-white rounded-lg font-medium hover:bg-hagu-primary/90 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-hagu-bg-light border-t border-hagu-border px-4 py-2 lg:hidden">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center py-2 px-3">
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path
                  d="M21 21L16.514 16.506L21 21ZM18.485 10.485C18.485 15.054 14.54 18.999 9.97 18.999C5.401 18.999 1.456 15.054 1.456 10.485C1.456 5.916 5.401 1.971 9.97 1.971C14.54 1.971 18.485 5.916 18.485 10.485Z"
                  stroke="#828282"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xs text-hagu-text-secondary">Explore</span>
          </Link>

          <Link href="/favorites" className="flex flex-col items-center py-2 px-3">
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path
                  d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61Z"
                  stroke="#828282"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xs text-hagu-text-secondary">Favorites</span>
          </Link>

          <Link href="/chat" className="flex flex-col items-center py-2 px-3 relative">
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path
                  d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                  stroke="#828282"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">1</span>
            </div>
            <span className="text-xs text-[#2f80ed] font-medium">Chat</span>
          </Link>

          <Link href="/bookings" className="flex flex-col items-center py-2 px-3 relative">
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#2f80ed" strokeWidth="2" fill="none" />
                <line x1="16" y1="2" x2="16" y2="6" stroke="#2f80ed" strokeWidth="2" />
                <line x1="8" y1="2" x2="8" y2="6" stroke="#2f80ed" strokeWidth="2" />
                <line x1="3" y1="10" x2="21" y2="10" stroke="#2f80ed" strokeWidth="2" />
              </svg>
            </div>
            {pendingBookingsCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-hagu-error rounded-full flex items-center justify-center">
                <span className="text-xs text-hagu-white font-medium">{pendingBookingsCount}</span>
              </div>
            )}
            <span className="text-xs text-[#2f80ed] font-medium">Bookings</span>
          </Link>

          <Link href="/profile" className="flex flex-col items-center py-2 px-3 relative">
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                  stroke="#828282"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="7" r="4" stroke="#828282" strokeWidth="2" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">1</span>
            </div>
            <span className="text-xs text-hagu-text-secondary">Profile</span>
          </Link>
        </div>
        <div className="w-32 h-1 bg-black rounded-full mx-auto mt-2"></div>
      </div>
    </div>
  )
}

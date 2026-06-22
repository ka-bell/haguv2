"use client"

import { Calendar } from "lucide-react"
import { useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { SegmentedPillGroup } from "@/components/ui/segmented-pill-group"
import { Tag } from "@/components/ui/tag"

type BookingStatus = "confirmed" | "pending"

type Booking = {
  id: string
  name: string
  activity: string
  status: BookingStatus
  date: string
  price: string
  avatar: string
}

const TABS = [
  { value: "requests", label: "Requests" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

const BOOKINGS: Booking[] = [
  {
    id: "1",
    name: "Luca M.",
    activity: "Dinner for two",
    status: "confirmed",
    date: "Fri 6 Jun · 19:00",
    price: "€95",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Emma K.",
    activity: "Cuddling session",
    status: "confirmed",
    date: "Sat 7 Jun · 20:00",
    price: "€60",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Tom B.",
    activity: "Event companion",
    status: "pending",
    date: "Sun 8 Jun · 15:00",
    price: "€130",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face",
  },
]

const STATUS_TAG: Record<BookingStatus, { label: string; className: string }> = {
  confirmed: { label: "Confirmed", className: "bg-[#EAF7F5] text-[#3DA89E]" },
  pending: { label: "Pending", className: "bg-[#FFF8E7] text-[#D4900A]" },
}

export function HaguBookingsScreen() {
  const [activeTab, setActiveTab] = useState<string[]>(["upcoming"])

  return (
    <div className="space-y-5">
      <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">Bookings</h1>

      <div className="-mx-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <SegmentedPillGroup options={TABS} value={activeTab} onChange={setActiveTab} multiSelect={false} />
      </div>

      <div className="space-y-5">
        {BOOKINGS.map((booking) => {
          const status = STATUS_TAG[booking.status]
          return (
            <article
              key={booking.id}
              className="rounded-[20px] border border-black/[0.06] bg-white px-5 pb-5 pt-5 shadow-[0px_2px_8px_rgba(26,26,30,0.04)]"
            >
              <div className="flex items-center gap-3">
                <Avatar src={booking.avatar} alt={booking.name} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-[#1A1A1E]">{booking.name}</p>
                  <p className="text-xs text-[#8A8A96]">{booking.activity}</p>
                </div>
                <Tag className={`shrink-0 text-[11px] font-semibold ${status.className}`}>{status.label}</Tag>
              </div>
              <div className="mt-3.5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F7F6F3] px-3 py-1.5 text-xs text-[#4A4A52]">
                  <Calendar className="size-3" />
                  {booking.date}
                </span>
                <Tag variant="outlined" className="rounded-lg bg-[#F7F6F3] px-3 py-1.5 text-xs font-semibold text-[#1A1A1E]">
                  {booking.price}
                </Tag>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

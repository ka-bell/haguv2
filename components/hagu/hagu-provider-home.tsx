"use client"

import { ChevronRight, MapPin, MessageCircle } from "lucide-react"

export function HaguProviderHome() {
  return (
    <div className="space-y-5">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] text-[#8A8A96]">Good evening,</p>
          <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">Sarah</h1>
        </div>
        <div className="relative">
          <div className="size-12 overflow-hidden rounded-3xl border-2 border-white bg-[#D0F1F0]/50" />
          <span className="absolute bottom-0 right-0 size-3.5 rounded-[7px] border-2 border-white bg-[#D0F1F0]" />
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] bg-[#2D1012] p-6">
        <div className="rounded-[24px] bg-[#2D1012]/10 px-3.5 py-6 backdrop-blur-[20px]">
          <p className="text-xs font-medium uppercase tracking-wide text-white/50">This month</p>
          <p className="mt-1 text-[36px] font-bold tracking-tight text-white">€ 1.240</p>
          <div className="mt-3 flex gap-5 border-t border-white/10 pt-3">
            <Stat label="Sessions" value="14" />
            <Divider />
            <Stat label="Avg. rating" value="4.9 ⭐" />
            <Divider />
            <Stat label="Pending" value="€ 95" valueClassName="text-[#D0F1F0]" />
          </div>
        </div>
      </div>

      <p className="text-xs font-medium uppercase tracking-wide text-[#1A1A1E]">Next Booking</p>

      <div className="rounded-[20px] border border-black/[0.06] bg-white px-5 pb-5 pt-3 shadow-[0px_2px_8px_rgba(26,26,30,0.04)]">
        <div className="flex items-center gap-3.5">
          <div className="size-[52px] shrink-0 rounded-[26px] bg-[#D0F1F0]/60" />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-medium text-[#1A1A1E]">Dinner with Luca</p>
            <p className="text-[13px] text-[#8A8A96]">Tomorrow · 19:00 – 21:00</p>
          </div>
          <div className="text-right">
            <p className="text-base font-bold text-[#1A1A1E]">€95</p>
            <p className="text-[11px] text-[#2D1012]">2 hrs</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="button" className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-[#F7F6F3] text-xs font-medium text-[#2D1012]">
            <MapPin className="size-3.5" />
            De Pijp
          </button>
          <button type="button" className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-[#2D1012] text-xs font-medium text-white">
            <MessageCircle className="size-3.5" />
            Message
          </button>
        </div>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-between rounded-2xl bg-[rgba(208,241,240,0.4)] px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-[10px] bg-[#D0F1F0]" />
          <div>
            <p className="text-sm font-medium text-[#1A1A1E]">3 new requests</p>
            <p className="text-xs text-[#8A8A96]">Waiting for your reply</p>
          </div>
        </div>
        <ChevronRight className="size-4 text-[#8A8A96]" />
      </button>
    </div>
  )
}

function Stat({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div>
      <p className="text-[11px] text-white/40">{label}</p>
      <p className={valueClassName ?? "text-base text-white"}>{value}</p>
    </div>
  )
}

function Divider() {
  return <div className="w-px self-stretch bg-white/10" />
}

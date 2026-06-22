"use client"

import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  MoreVertical,
  Paperclip,
  Send,
  Smile,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"

const AVATAR_SARAH =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face"
const AVATAR_BOOKING =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face"

type Message =
  | { type: "incoming"; text: string; time: string }
  | { type: "outgoing"; text: string; time: string; variant: "gradient" | "dark" }
  | { type: "typing" }

const MESSAGES: Message[] = [
  {
    type: "incoming",
    text: "Hi Alex! I saw you liked my profile 😊 I love your taste in contemporary art.",
    time: "10:14 AM",
  },
  {
    type: "outgoing",
    variant: "gradient",
    text: "Thank you! I've been following the Stedelijk's new acquisitions closely. Do you have a favourite piece there?",
    time: "10:16 AM",
  },
  {
    type: "incoming",
    text: "Oh definitely the Mondrian retrospective! There's something so meditative about standing in front of the originals.",
    time: "10:18 AM",
  },
  {
    type: "outgoing",
    variant: "dark",
    text: "Completely agree. I was there last week actually. The grid compositions feel almost architectural in person.",
    time: "10:21 AM",
  },
  {
    type: "incoming",
    text: "I loved that exhibition you mentioned! 🎨 Would you be interested in visiting the new Munch exhibit together sometime?",
    time: "10:24 AM",
  },
  {
    type: "outgoing",
    variant: "gradient",
    text: "That sounds wonderful! I'd love that. Are you free this Thursday evening?",
    time: "10:26 AM",
  },
  { type: "typing" },
]

export function HaguChatThread() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#F7F6F3]">
      <header className="shrink-0 border-b border-black/[0.05] bg-white/95 px-5 pb-3 pt-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.bookings}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F0EEE9] text-[#1A1A1E]"
            aria-label="Back"
          >
            <ArrowLeft className="size-[18px]" />
          </Link>

          <div className="relative shrink-0">
            <div className="size-11 overflow-hidden rounded-full border-2 border-[rgba(91,191,181,0.3)] p-0.5">
              <Image src={AVATAR_SARAH} alt="" width={44} height={44} className="size-full rounded-full object-cover" />
            </div>
            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-[#5BBFB5]" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-[#1A1A1E]">Sarah.</p>
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#5BBFB5]" />
              <p className="text-xs text-[#8A8A96]">Active now · Art Historian</p>
            </div>
          </div>

          <button
            type="button"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F0EEE9] text-[#1A1A1E]"
            aria-label="More options"
          >
            <MoreVertical className="size-[17px]" />
          </button>
        </div>
      </header>

      <div className="shrink-0 bg-gradient-to-b from-[rgba(91,191,181,0.08)] to-transparent px-5 pb-4 pt-3">
        <div className="relative overflow-hidden rounded-[24px] bg-[#1A1A1E] p-5 shadow-[0px_4px_16px_rgba(26,26,30,0.06)]">
          <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[#5BBFB5] opacity-10 blur-[32px]" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.55px] text-white/60">Active Request</p>
              <p className="mt-1 text-lg font-medium text-white">Dinner with Sarah</p>
            </div>
            <span className="rounded-full border border-[rgba(91,191,181,0.2)] bg-[rgba(91,191,181,0.2)] px-3 py-1 text-[10px] font-bold text-[#EAF7F5] backdrop-blur-sm">
              CONFIRMED
            </span>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="size-12 overflow-hidden rounded-full border-2 border-white/10 p-0.5">
              <Image src={AVATAR_BOOKING} alt="" width={48} height={48} className="size-full rounded-full object-cover" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[13px] font-medium text-white/90">
                <Clock className="size-3.5 text-white/70" />
                Tonight, 19:00
              </div>
              <div className="flex items-center gap-2 text-[13px] text-white/60">
                <Calendar className="size-3.5 text-white/50" />
                2 hours
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-black/[0.06]" />
          <span className="rounded-full bg-[#F0EEE9] px-3 py-1 text-[11px] font-medium text-[#B8B8C2]">Today</span>
          <div className="h-px flex-1 bg-black/[0.06]" />
        </div>

        {MESSAGES.map((message, index) => {
          if (message.type === "typing") {
            return (
              <div key={index} className="flex items-end gap-2.5">
                <Avatar />
                <div className="rounded-bl-[20px] rounded-br-[20px] rounded-tl-[4px] rounded-tr-[20px] bg-white px-4 py-3 shadow-[0px_2px_4px_rgba(26,26,30,0.05)]">
                  <div className="flex gap-1.5">
                    <span className="size-1.5 animate-pulse rounded-full bg-[#8A8A96]" />
                    <span className="size-1.5 animate-pulse rounded-full bg-[#8A8A96] [animation-delay:150ms]" />
                    <span className="size-1.5 animate-pulse rounded-full bg-[#8A8A96] [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )
          }

          if (message.type === "incoming") {
            return (
              <div key={index} className="flex items-end gap-2.5">
                <Avatar />
                <div className="max-w-[75%]">
                  <div className="rounded-bl-[20px] rounded-br-[20px] rounded-tl-[4px] rounded-tr-[20px] bg-white px-4 py-3 text-sm leading-[1.6] text-[#1A1A1E] shadow-[0px_2px_4px_rgba(26,26,30,0.05)]">
                    {message.text}
                  </div>
                  <p className="mt-1 pl-1 text-[10px] text-[#B8B8C2]">{message.time}</p>
                </div>
              </div>
            )
          }

          return (
            <div key={index} className="flex flex-col items-end">
              <div
                className={`max-w-[75%] rounded-bl-[20px] rounded-br-[20px] rounded-tl-[20px] rounded-tr-[4px] px-4 py-3 text-sm leading-[1.6] text-white ${
                  message.variant === "gradient"
                    ? "bg-gradient-to-br from-[#5BBFB5] to-[#3DA89E]"
                    : "bg-[#1A1A1E]"
                }`}
              >
                {message.text}
              </div>
              <div className="mt-1 flex items-center gap-1">
                <span className="text-[10px] text-[#B8B8C2]">{message.time}</span>
                <Check className="size-3.5 text-[#5BBFB5]" />
              </div>
            </div>
          )
        })}
      </div>

      <footer className="shrink-0 border-t border-black/[0.06] bg-white/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F0EEE9] text-[#1A1A1E]"
            aria-label="Attach file"
          >
            <Paperclip className="size-[18px]" />
          </button>
          <div className="flex h-11 flex-1 items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#F0EEE9] px-4">
            <span className="flex-1 text-sm text-[#B8B8C2]">Message Sarah…</span>
            <Smile className="size-[18px] shrink-0 text-[#B8B8C2]" />
          </div>
          <button
            type="button"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1A1A1E] text-white shadow-[0px_4px_8px_rgba(26,26,30,0.06)]"
            aria-label="Send message"
          >
            <Send className="size-[18px]" />
          </button>
        </div>
      </footer>
    </div>
  )
}

function Avatar() {
  return (
    <div className="mb-1 size-7 shrink-0 overflow-hidden rounded-full border border-[#E5E7EB]">
      <Image src={AVATAR_SARAH} alt="" width={28} height={28} className="size-full object-cover" />
    </div>
  )
}

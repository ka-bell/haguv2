"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HaguToggle } from "@/components/ui/hagu-toggle"
import { cn } from "@/lib/utils"

type DayState = "outside" | "available" | "selected" | "closed" | "booked"

type CalendarDay = {
  day: number
  state: DayState
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const

/** June 2025 grid from Figma node 2467:14009 */
const CALENDAR_DAYS: CalendarDay[] = [
  { day: 26, state: "outside" },
  { day: 27, state: "outside" },
  { day: 28, state: "outside" },
  { day: 29, state: "outside" },
  { day: 30, state: "outside" },
  { day: 31, state: "outside" },
  { day: 1, state: "available" },
  { day: 2, state: "available" },
  { day: 3, state: "selected" },
  { day: 4, state: "available" },
  { day: 5, state: "closed" },
  { day: 6, state: "booked" },
  { day: 7, state: "booked" },
  { day: 8, state: "booked" },
  { day: 9, state: "available" },
  { day: 10, state: "available" },
  { day: 11, state: "closed" },
  { day: 12, state: "closed" },
  { day: 13, state: "available" },
  { day: 14, state: "available" },
  { day: 15, state: "available" },
  { day: 16, state: "closed" },
  { day: 17, state: "available" },
  { day: 18, state: "available" },
  { day: 19, state: "available" },
  { day: 20, state: "available" },
  { day: 21, state: "booked" },
  { day: 22, state: "available" },
]

const TIME_SLOTS = [
  { id: "morning", label: "Morning (09:00–12:00)", hint: "Weekdays only", defaultOn: false },
  { id: "afternoon", label: "Afternoon (13:00–17:00)", hint: "All days", defaultOn: true },
  { id: "evening", label: "Evening (18:00–23:00)", hint: "All days", defaultOn: true },
] as const

const DAY_STYLES: Record<DayState, string> = {
  outside: "text-[#B8B8C2]",
  available: "bg-[#EAF7F5] text-[#3DA89E]",
  selected: "border-2 border-[#5BBFB5] text-[#1A1A1E]",
  closed: "text-[#B8B8C2]",
  booked: "bg-[#1A1A1E] text-white",
}

export function HaguCalendarScreen() {
  const [selectedDay, setSelectedDay] = useState(3)
  const [slots, setSlots] = useState<Record<string, boolean>>({
    morning: false,
    afternoon: true,
    evening: true,
  })

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">Calendar</h1>
          <p className="mt-1.5 text-sm text-[#8A8A96]">
            Manage your availability. Clients see open slots only.
          </p>
        </div>
        <Button size="sm" className="mt-1 h-9 shrink-0 px-4 text-[13px]">
          + Block time
        </Button>
      </div>

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-2xl bg-[#F7F6F3] text-[#1A1A1E]"
          aria-label="Previous month"
        >
          <ChevronLeft className="size-3.5" />
        </button>
        <p className="text-base font-semibold text-[#1A1A1E]">June 2025</p>
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-2xl bg-[#F7F6F3] text-[#1A1A1E]"
          aria-label="Next month"
        >
          <ChevronRight className="size-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((label) => (
          <div key={label} className="py-1 text-center text-[11px] font-semibold text-[#B8B8C2]">
            {label}
          </div>
        ))}
        {CALENDAR_DAYS.map((cell) => {
          const isSelected = cell.day === selectedDay && cell.state !== "outside" && cell.state !== "booked"
          const state = isSelected ? "selected" : cell.state === "selected" ? "available" : cell.state

          return (
            <button
              key={cell.day}
              type="button"
              disabled={cell.state === "outside" || cell.state === "booked"}
              onClick={() => {
                if (cell.state !== "outside" && cell.state !== "booked") {
                  setSelectedDay(cell.day)
                }
              }}
              className={cn(
                "flex size-10 items-center justify-center rounded-[20px] text-[13px] font-medium transition",
                DAY_STYLES[state],
                cell.state === "outside" && "pointer-events-none",
              )}
            >
              {cell.day}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-4 pt-1">
        <LegendItem color="border border-[#5BBFB5] bg-[#EAF7F5]" label="Available" />
        <LegendItem color="bg-[#1A1A1E]" label="Booked" />
        <LegendItem color="border border-black/10 bg-[#F7F6F3]" label="Closed" />
      </div>

      <article className="rounded-[20px] border border-black/[0.06] bg-white px-5 py-5 shadow-[0px_2px_8px_rgba(26,26,30,0.04)]">
        <h2 className="text-sm font-semibold text-[#1A1A1E]">Default time slots</h2>
        <div className="mt-4 space-y-5">
          {TIME_SLOTS.map((slot) => (
            <div key={slot.id} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[#1A1A1E]">{slot.label}</p>
                <p className="text-[11px] text-[#8A8A96]">{slot.hint}</p>
              </div>
              <HaguToggle
                label={slot.label}
                checked={slots[slot.id]}
                onChange={(checked) => setSlots((prev) => ({ ...prev, [slot.id]: checked }))}
              />
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("size-2.5 rounded-[5px]", color)} />
      <span className="text-xs text-[#8A8A96]">{label}</span>
    </div>
  )
}

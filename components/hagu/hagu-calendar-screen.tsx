"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HaguToggle } from "@/components/ui/hagu-toggle"
import { HaguPrototypeSheet } from "@/components/hagu/hagu-prototype-sheet"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

type DayState = "outside" | "available" | "selected" | "closed" | "booked"

type CalendarDay = {
  day: number
  state: DayState
}

type Overlay =
  | "block-time"
  | "booked-detail"
  | "closed-day"
  | "day-availability"
  | "slot-confirm"
  | null

type SlotConfirm = { id: string; label: string } | null

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const
const MONTHS = ["June 2025", "July 2025", "August 2025"] as const

const BOOKED_DETAILS: Record<number, { name: string; activity: string; time: string }> = {
  6: { name: "Luca M.", activity: "Dinner for two", time: "Fri 6 Jun · 19:00" },
  7: { name: "Emma K.", activity: "Cuddling session", time: "Sat 7 Jun · 20:00" },
  8: { name: "Tom B.", activity: "Event companion", time: "Sun 8 Jun · 15:00" },
  21: { name: "Luca M.", activity: "Follow-up dinner", time: "Sat 21 Jun · 19:00" },
}

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
  { day: 3, state: "available" },
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
  { id: "morning", label: "Morning (09:00–12:00)", hint: "Weekdays only" },
  { id: "afternoon", label: "Afternoon (13:00–17:00)", hint: "All days" },
  { id: "evening", label: "Evening (18:00–23:00)", hint: "All days" },
] as const

const DAY_STYLES: Record<DayState, string> = {
  outside: "text-[#B8B8C2]",
  available: "bg-[#EAF7F5] text-[#3DA89E] hover:bg-[#D0F1F0]",
  selected: "border-2 border-[#5BBFB5] text-[#1A1A1E]",
  closed: "text-[#B8B8C2] hover:bg-[#F7F6F3]",
  booked: "bg-[#1A1A1E] text-white hover:opacity-90",
}

export function HaguCalendarScreen() {
  const [monthIndex, setMonthIndex] = useState(0)
  const [selectedDay, setSelectedDay] = useState(3)
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [slotConfirm, setSlotConfirm] = useState<SlotConfirm>(null)
  const [slots, setSlots] = useState<Record<string, boolean>>({
    morning: false,
    afternoon: true,
    evening: true,
  })

  const month = MONTHS[monthIndex]
  const isJune = monthIndex === 0
  const booked = BOOKED_DETAILS[selectedDay]

  const handleDayPress = (cell: CalendarDay) => {
    if (cell.state === "outside") return
    setSelectedDay(cell.day)

    if (cell.state === "booked") {
      setOverlay("booked-detail")
      return
    }
    if (cell.state === "closed") {
      setOverlay("closed-day")
      return
    }
    setOverlay("day-availability")
  }

  const handleSlotToggle = (id: string, label: string, checked: boolean) => {
    if (!checked) {
      setSlotConfirm({ id, label })
      return
    }
    setSlots((prev) => ({ ...prev, [id]: true }))
  }

  const confirmSlotOff = () => {
    if (!slotConfirm) return
    setSlots((prev) => ({ ...prev, [slotConfirm.id]: false }))
    setSlotConfirm(null)
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-semibold tracking-tight text-[#1A1A1E]">Calendar</h1>
            <p className="mt-1.5 text-sm text-[#8A8A96]">
              Manage your availability. Clients see open slots only.
            </p>
          </div>
          <Button size="sm" className="mt-1 h-9 shrink-0 px-4 text-[13px]" onClick={() => setOverlay("block-time")}>
            + Block time
          </Button>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-2xl bg-[#F7F6F3] text-[#1A1A1E] active:scale-95"
            aria-label="Previous month"
            onClick={() => setMonthIndex((i) => Math.max(0, i - 1))}
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <p className="text-base font-semibold text-[#1A1A1E]">{month}</p>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-2xl bg-[#F7F6F3] text-[#1A1A1E] active:scale-95"
            aria-label="Next month"
            onClick={() => setMonthIndex((i) => Math.min(MONTHS.length - 1, i + 1))}
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>

        {isJune ? (
          <>
            <div className="grid grid-cols-7 gap-1">
              {WEEKDAYS.map((label) => (
                <div key={label} className="py-1 text-center text-[11px] font-semibold text-[#B8B8C2]">
                  {label}
                </div>
              ))}
              {CALENDAR_DAYS.map((cell) => {
                const isSelected = cell.day === selectedDay && cell.state !== "outside"
                const visualState = isSelected ? "selected" : cell.state

                return (
                  <button
                    key={cell.day}
                    type="button"
                    disabled={cell.state === "outside"}
                    onClick={() => handleDayPress(cell)}
                    className={cn(
                      "flex size-10 items-center justify-center rounded-[20px] text-[13px] font-medium transition active:scale-95",
                      DAY_STYLES[visualState],
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
          </>
        ) : (
          <div className="rounded-[20px] border border-dashed border-black/15 bg-black/[0.02] px-5 py-10 text-center">
            <p className="text-sm font-medium text-[#1A1A1E]">Empty month state</p>
            <p className="mt-1 text-xs text-[#8A8A96]">
              Design in Figma: calendar with no bookings/blocks yet, CTA to set availability.
            </p>
          </div>
        )}

        {isJune && selectedDay ? (
          <button
            type="button"
            onClick={() => setOverlay("day-availability")}
            className="w-full rounded-2xl bg-[rgba(208,241,240,0.4)] px-4 py-3 text-left transition active:opacity-80"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-[#4A4A52]">Selected day</p>
            <p className="mt-0.5 text-sm font-medium text-[#1A1A1E]">
              {formatSelectedDay(selectedDay)} · Tap to edit availability
            </p>
          </button>
        ) : null}

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
                  onChange={(checked) => handleSlotToggle(slot.id, slot.label, checked)}
                />
              </div>
            ))}
          </div>
        </article>

        <PrototypeMap />
      </div>

      <HaguPrototypeSheet
        open={overlay === "block-time"}
        onClose={() => setOverlay(null)}
        title="Block time"
        figmaLabel="Sheet · Block time"
      >
        <PrototypeField label="Date" value="Tue 3 Jun 2025" />
        <PrototypeField label="From" value="14:00" />
        <PrototypeField label="To" value="16:00" />
        <PrototypeField label="Reason" value="Personal appointment" />
        <p className="mt-3 text-xs text-[#8A8A96]">
          Design: bottom sheet with date picker, time range, optional note, and primary CTA &quot;Block slots&quot;.
        </p>
        <Button className="mt-4 w-full" onClick={() => setOverlay(null)}>
          Block slots
        </Button>
      </HaguPrototypeSheet>

      <HaguPrototypeSheet
        open={overlay === "day-availability"}
        onClose={() => setOverlay(null)}
        title={`Edit · ${formatSelectedDay(selectedDay)}`}
        figmaLabel="Sheet · Day availability"
      >
        <p className="text-sm text-[#8A8A96]">Override default slots for this day only.</p>
        <div className="mt-4 space-y-3">
          {TIME_SLOTS.map((slot) => (
            <div key={slot.id} className="flex items-center justify-between rounded-xl bg-[#F7F6F3] px-4 py-3">
              <span className="text-sm text-[#1A1A1E]">{slot.label}</span>
              <HaguToggle label={slot.label} checked={slots[slot.id]} onChange={() => undefined} />
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4 w-full" onClick={() => setOverlay("block-time")}>
          Block specific hours
        </Button>
      </HaguPrototypeSheet>

      <HaguPrototypeSheet
        open={overlay === "closed-day"}
        onClose={() => setOverlay(null)}
        title={`Closed · ${formatSelectedDay(selectedDay)}`}
        figmaLabel="Sheet · Reopen day"
      >
        <p className="text-sm text-[#8A8A96]">This day is marked closed. Clients cannot book.</p>
        <Button className="mt-4 w-full" onClick={() => setOverlay("day-availability")}>
          Open this day
        </Button>
        <Button variant="outline" className="mt-2 w-full" onClick={() => setOverlay(null)}>
          Keep closed
        </Button>
      </HaguPrototypeSheet>

      <HaguPrototypeSheet
        open={overlay === "booked-detail"}
        onClose={() => setOverlay(null)}
        title="Booking on this day"
        figmaLabel="Sheet · Booking detail"
      >
        {booked ? (
          <>
            <div className="rounded-[20px] border border-black/[0.06] bg-white p-4 shadow-[0px_2px_8px_rgba(26,26,30,0.04)]">
              <p className="font-semibold text-[#1A1A1E]">{booked.name}</p>
              <p className="text-sm text-[#8A8A96]">{booked.activity}</p>
              <p className="mt-2 text-xs text-[#4A4A52]">{booked.time}</p>
            </div>
            <p className="mt-3 text-xs text-[#8A8A96]">
              Design: quick view with link to full booking + message client. Cannot edit availability while booked.
            </p>
            <Link href={ROUTES.bookings} className="mt-4 block">
              <Button variant="outline" className="w-full">
                View in Bookings
              </Button>
            </Link>
          </>
        ) : null}
      </HaguPrototypeSheet>

      <HaguPrototypeSheet
        open={slotConfirm !== null}
        onClose={() => setSlotConfirm(null)}
        title="Turn off time slot?"
        figmaLabel="Dialog · Confirm disable slot"
      >
        <p className="text-sm text-[#8A8A96]">
          Disable <strong className="text-[#1A1A1E]">{slotConfirm?.label}</strong> for all matching days? Existing
          bookings are not affected.
        </p>
        <Button className="mt-4 w-full" onClick={confirmSlotOff}>
          Turn off
        </Button>
        <Button variant="outline" className="mt-2 w-full" onClick={() => setSlotConfirm(null)}>
          Cancel
        </Button>
      </HaguPrototypeSheet>
    </>
  )
}

function formatSelectedDay(day: number) {
  const map: Record<number, string> = {
    1: "Sun 1 Jun",
    2: "Mon 2 Jun",
    3: "Tue 3 Jun",
    4: "Wed 4 Jun",
    5: "Thu 5 Jun",
    6: "Fri 6 Jun",
    7: "Sat 7 Jun",
    8: "Sun 8 Jun",
    9: "Mon 9 Jun",
    10: "Tue 10 Jun",
    11: "Wed 11 Jun",
    12: "Thu 12 Jun",
    13: "Fri 13 Jun",
    14: "Sat 14 Jun",
    15: "Sun 15 Jun",
    16: "Mon 16 Jun",
    17: "Tue 17 Jun",
    18: "Wed 18 Jun",
    19: "Thu 19 Jun",
    20: "Fri 20 Jun",
    21: "Sat 21 Jun",
    22: "Sun 22 Jun",
  }
  return map[day] ?? `Day ${day} Jun`
}

function PrototypeField({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3 rounded-xl border border-black/[0.08] bg-[#F7F6F3] px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-[#8A8A96]">{label}</p>
      <p className="mt-0.5 text-sm text-[#1A1A1E]">{value}</p>
    </div>
  )
}

function PrototypeMap() {
  return (
    <details className="rounded-[20px] border border-black/[0.06] bg-white px-4 py-3 text-sm">
      <summary className="cursor-pointer font-medium text-[#1A1A1E]">Figma screens to design (calendar flow)</summary>
      <ul className="mt-3 space-y-2 text-xs text-[#8A8A96]">
        <li>
          <strong className="text-[#1A1A1E]">Calendar</strong> — main view (2467:14009) ✓
        </li>
        <li>
          <strong className="text-[#1A1A1E]">Sheet · Block time</strong> — + Block time / block hours
        </li>
        <li>
          <strong className="text-[#1A1A1E]">Sheet · Day availability</strong> — tap open day
        </li>
        <li>
          <strong className="text-[#1A1A1E]">Sheet · Reopen day</strong> — tap closed day
        </li>
        <li>
          <strong className="text-[#1A1A1E]">Sheet · Booking detail</strong> — tap booked day
        </li>
        <li>
          <strong className="text-[#1A1A1E]">Dialog · Confirm disable slot</strong> — toggle default slot off
        </li>
        <li>
          <strong className="text-[#1A1A1E]">Empty month state</strong> — month nav → July/August
        </li>
      </ul>
    </details>
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

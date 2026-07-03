"use client"

import Image from "next/image"
import { Moon, Sparkles, Sun } from "lucide-react"
import {
  bookingBannerClass,
  bookingCardClass,
  bookingDateClass,
  bookingPillClass,
} from "@/components/hagee/hagee-booking-chrome"
import {
  BOOKING_DATE_OPTIONS,
  BOOKING_DURATIONS,
  BOOKING_TIME_SLOTS,
  formatBookingDateLabel,
} from "@/lib/hagee-booking"
import { cn } from "@/lib/utils"

const TIME_ICONS = { sun: Sun, moon: Moon, sparkles: Sparkles } as const

export type SchedulePickerValue = {
  day: number | null
  dateLabel: string | null
  timeSlotId: string | null
  durationId?: string | null
}

type BookingSchedulePickerProps = {
  value: SchedulePickerValue
  onChange: (value: SchedulePickerValue) => void
  showDuration?: boolean
  availabilityHint?: {
    photo: string
    name: string
    availabilityLabel: string
  }
}

export function BookingSchedulePicker({
  value,
  onChange,
  showDuration = true,
  availabilityHint,
}: BookingSchedulePickerProps) {
  return (
    <div className="space-y-5">
      <section>
        <p className="hagu-section-label">Pick a date</p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {BOOKING_DATE_OPTIONS.map((option) => {
            const selected = value.day === option.day
            return (
              <button
                key={option.day}
                type="button"
                onClick={() =>
                  onChange({
                    ...value,
                    day: option.day,
                    dateLabel: formatBookingDateLabel(option.day),
                  })
                }
                className={bookingDateClass(selected)}
              >
                <span className="text-[11px] font-medium">{option.weekday}</span>
                <span className="mt-0.5 text-xl font-semibold leading-none">{option.day}</span>
                <span className="mt-1 text-[11px]">{option.month}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <p className="hagu-section-label">Preferred time</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {BOOKING_TIME_SLOTS.map((timeSlot) => {
            const selected = value.timeSlotId === timeSlot.id
            const Icon = timeSlot.icon ? TIME_ICONS[timeSlot.icon] : Sparkles
            return (
              <button
                key={timeSlot.id}
                type="button"
                onClick={() => onChange({ ...value, timeSlotId: timeSlot.id })}
                className={cn(bookingCardClass(selected), "px-3 py-3 text-center")}
              >
                <Icon className="mx-auto size-4 text-hagu-label" />
                <p className="mt-2 text-[13px] font-medium text-hagu-ink">{timeSlot.label}</p>
                <p className="mt-0.5 text-[11px] text-hagu-text-secondary">{timeSlot.subtitle}</p>
              </button>
            )
          })}
        </div>
      </section>

      {availabilityHint ? (
        <div className={cn(bookingBannerClass(), "flex items-start gap-3")}>
          <div className="relative size-7 shrink-0 overflow-hidden rounded-full border-2 border-white">
            <Image src={availabilityHint.photo} alt="" fill className="object-cover" sizes="28px" />
          </div>
          <p className="text-[13px] leading-relaxed text-hagu-label">
            {availabilityHint.name} is usually free {availabilityHint.availabilityLabel.toLowerCase()}. They&apos;ll
            confirm the exact time in chat.
          </p>
        </div>
      ) : null}

      {showDuration ? (
        <section>
          <p className="hagu-section-label">How long?</p>
          <div className="mt-3 flex gap-2">
            {BOOKING_DURATIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({ ...value, durationId: item.id })}
                className={cn(bookingPillClass(value.durationId === item.id), "flex-1 text-center")}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

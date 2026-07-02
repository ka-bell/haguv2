import type { LucideIcon } from "lucide-react"
import { Briefcase, Phone, Sparkles, UtensilsCrossed } from "lucide-react"

export type HageeActiveBooking = {
  title: string
  status: string
  companionPhoto: string
  time: string
  duration: string
}

export type HageeMoodOption = {
  id: string
  title: string
  subtitle: string
  icon: LucideIcon
}

/** Maps home mood cards to explore refine activity ids. */
export const HOME_MOOD_TO_ACTIVITIES: Record<string, string[]> = {
  dinner: ["meal"],
  event: ["social", "outing"],
  chat: ["conversation"],
  surprise: ["meal", "outing", "conversation", "social"],
}

export type HageeSpotlight = {
  name: string
  role: string
  photo: string
  rating: number
  tags: string[]
}

export type HageeNewArrival = {
  id: string
  name: string
  role: string
  photo: string
}

export const HAGEE_ACTIVE_BOOKING: HageeActiveBooking = {
  title: "Dinner with Sarah",
  status: "Confirmed",
  companionPhoto:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  time: "Tonight, 19:00",
  duration: "2 hours",
}

export const HAGEE_MOOD_OPTIONS: HageeMoodOption[] = [
  {
    id: "dinner",
    title: "Dinner Date",
    subtitle: "Fine dining & conversation",
    icon: UtensilsCrossed,
  },
  {
    id: "event",
    title: "Social Event",
    subtitle: "Galas, parties & mixers",
    icon: Briefcase,
  },
  {
    id: "chat",
    title: "Just Chat",
    subtitle: "Coffee & good talk",
    icon: Phone,
  },
  {
    id: "surprise",
    title: "Surprise Me",
    subtitle: "Curated selection",
    icon: Sparkles,
  },
]

export const HAGEE_DAILY_SPOTLIGHT: HageeSpotlight = {
  name: "Sophie M.",
  role: "Art historian & curator",
  photo:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  rating: 9.8,
  tags: ["Art", "Wine"],
}

export const HAGEE_NEW_ARRIVALS: HageeNewArrival[] = [
  {
    id: "elena",
    name: "Elena R.",
    role: "Fashion Designer",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "maya",
    name: "Maya S.",
    role: "Architect",
    photo:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "isabella",
    name: "Isabella T.",
    role: "Musician",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  },
]

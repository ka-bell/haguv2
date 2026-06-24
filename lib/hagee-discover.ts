import type { LucideIcon } from "lucide-react"
import {
  CalendarDays,
  Home,
  MessageCircle,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react"

export type HageeDiscoverStat = {
  value: string
  label: string
  highlight?: boolean
}

export type RefineActivity = {
  id: string
  label: string
  subtitle: string
  icon: LucideIcon
}

export type InterestCategory = {
  id: string
  label: string
  options: string[]
}

export type HageeMatch = {
  id: string
  name: string
  age: number
  photo: string
  matchPercent: number
  availableToday: boolean
  responseTime: string
  bio: string
  photoTags: string[]
  sharedTraits: string[]
  sharedInterests: string[]
}

export const HAGEE_CLIENT_NAME = "Alex"

export const HAGEE_DISCOVER_STATS: HageeDiscoverStat[] = [
  { value: "4", label: "In your area" },
  { value: "2", label: "Available today", highlight: true },
  { value: "1", label: "New this week" },
]

export const REFINE_ACTIVITIES: RefineActivity[] = [
  {
    id: "meal",
    label: "A meal together",
    subtitle: "Lunch, dinner, coffee — unhurried",
    icon: UtensilsCrossed,
  },
  {
    id: "outing",
    label: "An activity or outing",
    subtitle: "Walk, museum, market, sport",
    icon: Sparkles,
  },
  {
    id: "conversation",
    label: "A real conversation",
    subtitle: "Ideas, stories, honest talk",
    icon: MessageCircle,
  },
  {
    id: "at-home",
    label: "Something low-key at home",
    subtitle: "Cook, watch, just hang out",
    icon: Home,
  },
  {
    id: "social",
    label: "A social event or gathering",
    subtitle: "Go somewhere together",
    icon: CalendarDays,
  },
]

export const INTEREST_CATEGORIES: InterestCategory[] = [
  {
    id: "food",
    label: "Food & drink",
    options: ["Cooking", "Wine", "Coffee", "Restaurants", "Baking"],
  },
  {
    id: "arts",
    label: "Arts & culture",
    options: ["Film", "Theatre", "Art galleries", "Music", "Photography", "Literature"],
  },
  {
    id: "mind",
    label: "Mind & body",
    options: ["Yoga", "Running", "Meditation", "Hiking", "Cycling"],
  },
  {
    id: "ideas",
    label: "Ideas & learning",
    options: ["Philosophy", "Science", "Tech", "Psychology", "History", "Politics"],
  },
]

export const MATCH_FILTERS = [
  { id: "all", label: "All (4)" },
  { id: "today", label: "Available today" },
  { id: "meals", label: "Meals" },
  { id: "conversation", label: "Conversation" },
] as const

export type MatchFilterId = (typeof MATCH_FILTERS)[number]["id"]

export const HAGEE_MATCHES: HageeMatch[] = [
  {
    id: "sara",
    name: "Sara",
    age: 31,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    matchPercent: 88,
    availableToday: true,
    responseTime: "Responds within a few hours",
    bio: '"Curious about most things. Loves a long dinner with no agenda."',
    photoTags: ["Film", "Philosophy"],
    sharedTraits: ["🌙 Night owl", "📚 Deep diver", "😂 Dry humour"],
    sharedInterests: ["Desserts", "Indie & Rock", "Spy movies", "Wine & dine"],
  },
  {
    id: "luca",
    name: "Luca",
    age: 29,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    matchPercent: 82,
    availableToday: false,
    responseTime: "Usually replies same day",
    bio: '"Good at listening. Happy to wander the city with no plan."',
    photoTags: ["Coffee", "Walks"],
    sharedTraits: ["🧠 Overthinker", "⚡ Spontaneous"],
    sharedInterests: ["Philosophy", "Running", "Film"],
  },
]

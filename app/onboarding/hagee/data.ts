import type { LucideIcon } from "lucide-react"
import { Clock, Home, MessageCircle, Users } from "lucide-react"

export type HageeStep = 1 | 2 | 3 | 4 | 5 | 6

export const INTRO_HERO_IMAGE =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"

export const ACTIVITY_OPTIONS: {
  id: string
  label: string
  subtitle: string
  icon: LucideIcon
}[] = [
  { id: "social-time", label: "Social time", subtitle: "Meals, events, outings", icon: Users },
  { id: "conversation", label: "Conversation", subtitle: "Deep talks, ideas", icon: MessageCircle },
  { id: "activities", label: "Activities", subtitle: "Walks, museums, sport", icon: Clock },
  { id: "at-home", label: "At home", subtitle: "Cooking, watching, relaxing", icon: Home },
]

export const VIBE_OPTIONS = [
  "Calm & easy",
  "Playful",
  "Thoughtful",
  "Adventurous",
  "Spontaneous",
] as const

export const CHARACTER_OPTIONS = [
  { id: "night-owl", label: "Night owl", emoji: "🌙" },
  { id: "overthinker", label: "Overthinker", emoji: "🧠" },
  { id: "dry-humour", label: "Dry humour", emoji: "😂" },
  { id: "deep-diver", label: "Deep diver", emoji: "📚" },
  { id: "spontaneous", label: "Spontaneous", emoji: "⚡" },
  { id: "good-listener", label: "Good listener", emoji: "👂" },
] as const

export const CONTINUE_LABELS: Record<HageeStep, string> = {
  1: "Continue",
  2: "Continue",
  3: "Continue",
  4: "Continue",
  5: "Continue",
  6: "Start exploring",
}

export const WHATS_NEXT_ITEMS = [
  {
    id: "browse",
    title: "Browse companions",
    subtitle: "3 people available this week",
    done: true,
  },
  {
    id: "request",
    title: "Send your first request",
    subtitle: "Takes less than a minute",
    done: false,
  },
  {
    id: "chat",
    title: "Chat when matched",
    subtitle: "Coordinate time and place",
    done: false,
  },
] as const

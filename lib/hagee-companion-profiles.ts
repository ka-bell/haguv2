import { HAGEE_EXPLORE_MATCHES, type HageeExploreMatch } from "@/lib/hagee-explore"
import { HAGEE_DAILY_SPOTLIGHT, HAGEE_NEW_ARRIVALS } from "@/lib/hagee-home"

export type HageeCompanionService = {
  id: string
  label: string
  duration: string
  price: string
}

export type HageeCompanionProfile = {
  id: string
  name: string
  age: number
  photo: string
  photos: string[]
  coverImage: string
  rating: number
  verified: boolean
  availabilityLabel: string
  role: string
  tagline: string
  bio: string
  responseTime: string
  interests: string[]
  vibeTags: string[]
  services: HageeCompanionService[]
}

const SERVICE_CATALOG = {
  dinner: { id: "dinner", label: "Dinner for two", duration: "2 hours", price: "€95" },
  coffee: { id: "coffee", label: "Coffee & chat", duration: "1 hour", price: "€45" },
  museum: { id: "museum", label: "Museum visit", duration: "2 hours", price: "€75" },
  event: { id: "event", label: "Event companion", duration: "3 hours", price: "€130" },
  walk: { id: "walk", label: "City walk", duration: "1.5 hours", price: "€55" },
  wine: { id: "wine", label: "Wine tasting", duration: "2 hours", price: "€85" },
  concert: { id: "concert", label: "Concert companion", duration: "3 hours", price: "€110" },
} as const satisfies Record<string, HageeCompanionService>

function pickServices(...keys: (keyof typeof SERVICE_CATALOG)[]): HageeCompanionService[] {
  return keys.map((key) => SERVICE_CATALOG[key])
}

function servicesFromActivities(activities: string[]): HageeCompanionService[] {
  const map: Record<string, keyof typeof SERVICE_CATALOG> = {
    meal: "dinner",
    conversation: "coffee",
    outing: "walk",
  }
  const keys = activities.map((activity) => map[activity] ?? "coffee")
  return pickServices(...Array.from(new Set(keys)))
}

function withGallery(primary: string, extras: string[]): string[] {
  return [primary, ...extras.filter((photo) => photo !== primary)]
}

function fromExploreMatch(match: HageeExploreMatch, role?: string): HageeCompanionProfile {
  const galleryExtras: Record<string, string[]> = {
    elena: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80&sat=-20",
    ],
    sara: [
      "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80&sat=-15",
    ],
    luca: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80&sat=-10",
    ],
    mila: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80&sat=-20",
    ],
  }

  return {
    id: match.id,
    name: match.name,
    age: match.age,
    photo: match.photo,
    photos: withGallery(match.photo, galleryExtras[match.id] ?? []),
    coverImage: match.photo,
    rating: match.rating,
    verified: match.verified,
    availabilityLabel: match.availabilityLabel,
    role: role ?? match.vibeTags[0] ?? "Companion",
    tagline: match.tagline,
    bio: match.tagline,
    responseTime: match.responseTime,
    interests: match.interests,
    vibeTags: match.vibeTags,
    services: servicesFromActivities(match.activities),
  }
}

const EXTRA_PROFILES: HageeCompanionProfile[] = [
  {
    id: "sophie",
    name: "Sophie",
    age: 32,
    photo: HAGEE_DAILY_SPOTLIGHT.photo,
    photos: withGallery(HAGEE_DAILY_SPOTLIGHT.photo, [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80&sat=-15",
    ]),
    coverImage: HAGEE_DAILY_SPOTLIGHT.photo,
    rating: HAGEE_DAILY_SPOTLIGHT.rating,
    verified: true,
    availabilityLabel: "Available this week",
    role: HAGEE_DAILY_SPOTLIGHT.role,
    tagline: "Art historian · Curator · Great dinner companion",
    bio: "I love slow evenings with good wine, thoughtful conversation, and a bit of culture along the way.",
    responseTime: "Usually replies within a few hours",
    interests: HAGEE_DAILY_SPOTLIGHT.tags.concat(["Museums", "Literature"]),
    vibeTags: ["Art", "Wine", "Calm", "Curious"],
    services: pickServices("museum", "dinner", "wine"),
  },
  {
    id: "maya",
    name: "Maya",
    age: 30,
    photo: HAGEE_NEW_ARRIVALS.find((p) => p.id === "maya")!.photo,
    photos: withGallery(HAGEE_NEW_ARRIVALS.find((p) => p.id === "maya")!.photo, [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80&sat=-10",
      "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80",
    ]),
    coverImage: HAGEE_NEW_ARRIVALS.find((p) => p.id === "maya")!.photo,
    rating: 4.8,
    verified: true,
    availabilityLabel: "New on Hagu",
    role: "Architect",
    tagline: "City walks · Design · Quiet confidence",
    bio: "Happy to explore the city, talk about spaces and ideas, or keep things simple over coffee.",
    responseTime: "Responds within a day",
    interests: ["Architecture", "Design", "Coffee", "Photography"],
    vibeTags: ["Walks", "Design", "Low-key"],
    services: pickServices("walk", "coffee", "museum"),
  },
  {
    id: "isabella",
    name: "Isabella",
    age: 28,
    photo: HAGEE_NEW_ARRIVALS.find((p) => p.id === "isabella")!.photo,
    photos: withGallery(HAGEE_NEW_ARRIVALS.find((p) => p.id === "isabella")!.photo, [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80&sat=-10",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&w=900&q=80",
    ]),
    coverImage: HAGEE_NEW_ARRIVALS.find((p) => p.id === "isabella")!.photo,
    rating: 4.9,
    verified: true,
    availabilityLabel: "New on Hagu",
    role: "Musician",
    tagline: "Live music lover · Warm energy",
    bio: "I bring good vibes to dinners, concerts, and anywhere a little warmth helps the night feel easy.",
    responseTime: "Responds within a few hours",
    interests: ["Music", "Concerts", "Food", "Nightlife"],
    vibeTags: ["Music", "Social", "Warm"],
    services: pickServices("concert", "dinner", "event"),
  },
]

const ROLE_BY_ID = Object.fromEntries(HAGEE_NEW_ARRIVALS.map((p) => [p.id, p.role]))

const COMPANION_PROFILES: HageeCompanionProfile[] = [
  ...HAGEE_EXPLORE_MATCHES.map((match) => fromExploreMatch(match, ROLE_BY_ID[match.id])),
  ...EXTRA_PROFILES,
]

const PROFILE_BY_ID = new Map(COMPANION_PROFILES.map((profile) => [profile.id, profile]))

/** Booking card companion maps to Sara in explore data. */
export const HAGEE_BOOKING_COMPANION_ID = "sara"

export function getCompanionProfile(id: string): HageeCompanionProfile | null {
  return PROFILE_BY_ID.get(id) ?? null
}

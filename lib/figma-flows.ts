/**
 * Figma flow registry — source of truth links and screen inventory.
 * File: https://www.figma.com/design/YCZ3EsQcr4rUfTgPutKj3E/Hagu
 */

import { ROUTES } from "@/lib/routes"

export const FIGMA_FILE_KEY = "YCZ3EsQcr4rUfTgPutKj3E"

export const FIGMA_BASE = `https://www.figma.com/design/${FIGMA_FILE_KEY}/Hagu`

/** Build a Figma URL from a node id (`2467:13479` or `2467-13479`). */
export function figmaNode(nodeId: string): string {
  return `${FIGMA_BASE}?node-id=${nodeId.replace(":", "-")}`
}

export type FigmaFlowScreen = {
  id: string
  name: string
  figmaNodeId: string
  route?: string
  codePath?: string
  navTab?: "home" | "bookings" | "calendar" | "settings"
  notes?: string
}

export type FigmaFlow = {
  id: string
  name: string
  figmaNodeId: string
  description: string
  audience: "HAGEE" | "HAGU" | "both"
  screens: FigmaFlowScreen[]
}

/** HAGU provider — logged-in app tabs & sub-screens (frame `Body`). */
export const HAGU_PROVIDER_APP_FLOW: FigmaFlow = {
  id: "hagu-provider-app",
  name: "HAGU Provider App Flow",
  figmaNodeId: "2467:13479",
  description:
    "Post-onboarding HAGU provider experience: requests, bookings, chat, calendar, settings, and transactions.",
  audience: "HAGU",
  screens: [
    {
      id: "provider-home",
      name: "Provider Home",
      figmaNodeId: "2467:19060",
      route: "/discover",
      codePath: "app/(app)/discover/page.tsx",
      navTab: "home",
      notes: "Default Home tab. Earnings card, next booking, requests banner → Requests.",
    },
    {
      id: "requests",
      name: "Requests",
      figmaNodeId: "2467:13610",
      route: "/requests",
      codePath: "app/(app)/requests/page.tsx",
    },
    {
      id: "bookings",
      name: "Bookings",
      figmaNodeId: "2467:13749",
      route: "/bookings",
      codePath: "app/(app)/bookings/page.tsx",
      navTab: "bookings",
      notes: "Tabs: Requests · Upcoming · Past · Cancelled. NAV: Bookings active.",
    },
    {
      id: "chat-active-booking",
      name: "Chat — active booking (Sarah)",
      figmaNodeId: "2467:13855",
      route: "/chat",
      codePath: "app/(app)/chat/page.tsx",
      notes: "Active booking widget pinned above thread. Incoming/outgoing bubbles, typing indicator, input bar.",
    },
    {
      id: "calendar",
      name: "Calendar / Availability",
      figmaNodeId: "2467:14009",
      route: "/calendar",
      codePath: "app/(app)/calendar/page.tsx",
      navTab: "calendar",
      notes: "Month grid, legend, default time slots with toggles.",
    },
    {
      id: "settings",
      name: "Settings / Profile",
      figmaNodeId: "2467:14188",
      route: "/settings",
      codePath: "app/(app)/settings/page.tsx",
      navTab: "settings",
      notes: "Cover photo, stats, account/payout/preferences sections, log out. NAV: Settings active.",
    },
    {
      id: "transactions",
      name: "Transactions / Earnings",
      figmaNodeId: "2467:14361",
      route: "/settings/transactions",
      notes: "Available balance, withdraw, transaction history. Sub-page under Settings.",
    },
    {
      id: "chat-luca",
      name: "Chat — Luca M.",
      figmaNodeId: "2467:14477",
      route: "/chat",
      notes: "Standard thread with header (Online · Booking date). Same route as chat tab, different state.",
    },
    {
      id: "review-post-booking",
      name: "Review (post-booking)",
      figmaNodeId: "2467:14555",
      route: "/reviews/luca-dinner",
      codePath: "app/(app)/reviews/[id]/page.tsx",
      notes: "Star ratings, criteria, optional note, accept-again toggle. Home banner when pending.",
    },
  ],
}

/** HAGEE client — onboarding + profile (frame `2467:15227`). */
export const HAGEE_CLIENT_FLOW: FigmaFlow = {
  id: "hagee-client",
  name: "HAGEE Client Flow",
  figmaNodeId: "2467:15227",
  description: "HAGEE onboarding and profile screens.",
  audience: "HAGEE",
  screens: [
    { id: "intro", name: "What is HAGU", figmaNodeId: "2467:15232", route: ROUTES.onboardingHagee, codePath: "app/onboarding/page.tsx" },
    { id: "account", name: "Create Account", figmaNodeId: "2467:15232", route: ROUTES.onboardingHagee },
    { id: "preferences", name: "Preferences", figmaNodeId: "2467:15232", route: ROUTES.onboardingHagee },
    { id: "profile-setup", name: "Your Profile", figmaNodeId: "2467:15232", route: ROUTES.onboardingHagee },
    { id: "character", name: "Your character", figmaNodeId: "2467:15232", route: ROUTES.onboardingHagee },
    { id: "success", name: "You're in", figmaNodeId: "2467:15615", route: ROUTES.onboardingHagee },
    { id: "profile", name: "My profile", figmaNodeId: "2467:15693", route: ROUTES.profile, codePath: "components/hagee/hagee-profile-screen.tsx" },
    { id: "profile-edit", name: "Edit profile", figmaNodeId: "2467:15693", route: `${ROUTES.onboardingHagee}?edit=1&step=4` },
  ],
}

/** Auth + onboarding flows (existing frames). */
export const AUTH_ONBOARDING_FLOWS: FigmaFlow[] = [
  {
    id: "hagee-onboarding",
    name: "HAGEE Onboarding",
    figmaNodeId: "2467:15227",
    description: "Client onboarding after selecting HAGEE.",
    audience: "HAGEE",
    screens: [
      { id: "intro", name: "Intro carousel", figmaNodeId: "2467:15232", route: "/onboarding" },
      { id: "account", name: "Create account", figmaNodeId: "2467:15232", route: "/onboarding" },
      { id: "preferences", name: "What are you looking for?", figmaNodeId: "2467:15232", route: "/onboarding" },
      { id: "about", name: "About you", figmaNodeId: "2467:15232", route: "/onboarding" },
      { id: "character", name: "Character traits", figmaNodeId: "2467:15232", route: "/onboarding" },
      { id: "success", name: "All set", figmaNodeId: "2467:15615", route: "/onboarding" },
    ],
  },
  {
    id: "hagu-onboarding",
    name: "HAGU Provider Onboarding",
    figmaNodeId: "2424:11787",
    description: "9-step provider onboarding after selecting HAGU.",
    audience: "HAGU",
    screens: [
      { id: "intro", name: "Intro", figmaNodeId: "2424:11787", route: "/onboarding/hagu" },
      { id: "profile-basics", name: "Profile Basics", figmaNodeId: "2468:19975", route: "/onboarding/hagu", codePath: "app/onboarding/hagu/page.tsx" },
      { id: "the-real-you", name: "The Real You", figmaNodeId: "2424:11787", route: "/onboarding/hagu" },
      { id: "rates", name: "Rates & Logistics", figmaNodeId: "2468:20300", route: "/onboarding/hagu" },
      { id: "activity-menu", name: "Activity Menu", figmaNodeId: "2424:11787", route: "/onboarding/hagu" },
      { id: "availability", name: "Availability", figmaNodeId: "2424:11787", route: "/onboarding/hagu" },
      { id: "identity-id", name: "Identity (ID)", figmaNodeId: "2424:11787", route: "/onboarding/hagu" },
      { id: "identity-social", name: "Identity (Social)", figmaNodeId: "2424:11787", route: "/onboarding/hagu" },
      { id: "get-paid", name: "Get Paid", figmaNodeId: "2424:11787", route: "/onboarding/hagu" },
    ],
  },
]

/** Figma bottom nav vs current code routes. */
export const NAV_MAPPING = {
  figma: [
    { tab: "Home", icon: "house", screens: ["Provider Home", "Requests"] },
    { tab: "Bookings", icon: "calendar-check", screens: ["Bookings"] },
    { tab: "Calendar", icon: "calendar", screens: ["Calendar / Availability"] },
    { tab: "Settings", icon: "user", screens: ["Settings / Profile", "Transactions"] },
  ],
  code: [
    { tab: "Discover", route: "/discover", mapsTo: "Home (Provider Home)" },
    { tab: "Bookings", route: "/bookings", mapsTo: "Bookings" },
    { tab: "Calendar", route: "/calendar", mapsTo: "Calendar / Availability" },
    { tab: "Settings", route: "/settings", mapsTo: "Settings" },
  ],
} as const

export const ALL_FLOWS: FigmaFlow[] = [HAGU_PROVIDER_APP_FLOW, HAGEE_CLIENT_FLOW, ...AUTH_ONBOARDING_FLOWS]

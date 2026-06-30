import { HAGU_PROVIDER_PROFILE } from "@/lib/hagu-provider-profile"

export const PROVIDER_PROFILE = {
  firstName: HAGU_PROVIDER_PROFILE.firstName,
  photo: HAGU_PROVIDER_PROFILE.photo,
} as const

export type AgendaItemType = "booking" | "open" | "blocked"

export type ProviderAgendaItem = {
  id: string
  time: string
  title: string
  subtitle?: string
  type: AgendaItemType
  chatId?: string
}

export const PROVIDER_TODAY_LABEL = "Friday, 6 June"

export const PROVIDER_TODAY_AGENDA: ProviderAgendaItem[] = [
  {
    id: "agenda-open",
    time: "09:00",
    title: "Morning slots open",
    type: "open",
  },
  {
    id: "agenda-luca",
    time: "19:00",
    title: "Dinner for two",
    subtitle: "Luca M.",
    type: "booking",
    chatId: "luca",
  },
]

export type ProviderUnreadChat = {
  chatId: string
  name: string
  count: number
  avatar: string
  preview: string
}

export const PROVIDER_UNREAD_CHATS: ProviderUnreadChat[] = [
  {
    chatId: "luca",
    name: "Luca M.",
    count: 2,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
    preview: "Do you have a preference for a restaurant?",
  },
  {
    chatId: "emma",
    name: "Emma K.",
    count: 1,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face",
    preview: "Still works for Saturday at 20:00?",
  },
]

export const PROVIDER_UNREAD_TOTAL = PROVIDER_UNREAD_CHATS.reduce((sum, chat) => sum + chat.count, 0)

export type RequestDetail = {
  label: string
  value: string
  bold?: boolean
}

export type ProviderRequest = {
  id: string
  chatId: string
  name: string
  subtitle: string
  avatar: string
  price: string
  message?: string
  details?: RequestDetail[]
  summary?: string
  meta?: string
  expanded?: boolean
}

export type BookingStatus = "confirmed" | "pending"
export type BookingCategory = "upcoming" | "completed" | "cancelled"

export type ProviderBooking = {
  id: string
  chatId: string
  name: string
  activity: string
  status: BookingStatus
  category: BookingCategory
  date: string
  price: string
  avatar: string
  showCalendarIcon?: boolean
}

export const PROVIDER_REQUESTS: ProviderRequest[] = [
  {
    id: "req-1",
    chatId: "luca",
    name: "Luca M.",
    subtitle: "First booking · Verified",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
    price: "€95",
    expanded: true,
    details: [
      { label: "Activity", value: "Dinner for two" },
      { label: "Date", value: "Fri 6 Jun · 19:00" },
      { label: "Duration", value: "2 hours" },
      { label: "Total", value: "€95", bold: true },
    ],
    message: `"Looking for someone to join me for dinner in De Pijp. Love good conversation!"`,
  },
  {
    id: "req-2",
    chatId: "emma",
    name: "Emma K.",
    subtitle: "3 bookings · ⭐ 4.8",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face",
    price: "€60",
    summary: "Cuddling · Sat 7 Jun · 20:00",
    meta: "1 hour · At my place",
  },
  {
    id: "req-3",
    chatId: "tom",
    name: "Tom B.",
    subtitle: "First booking · Verified",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face",
    price: "€130",
    summary: "Event companion · Sun 8 Jun",
    meta: "3 hours · Public",
  },
]

export const PROVIDER_BOOKINGS: ProviderBooking[] = [
  {
    id: "1",
    chatId: "luca",
    name: "Luca M.",
    activity: "Dinner for two",
    status: "confirmed",
    category: "upcoming",
    date: "Fri 6 Jun · 19:00",
    price: "€95",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
    showCalendarIcon: true,
  },
  {
    id: "4",
    chatId: "sofia",
    name: "Sofia R.",
    activity: "Museum visit",
    status: "confirmed",
    category: "completed",
    date: "Mon 2 Jun · 14:00",
    price: "€75",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=face",
  },
  {
    id: "2",
    chatId: "emma",
    name: "Emma K.",
    activity: "Cuddling session",
    status: "confirmed",
    category: "upcoming",
    date: "Sat 7 Jun · 20:00",
    price: "€60",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face",
  },
  {
    id: "5",
    chatId: "mark",
    name: "Mark D.",
    activity: "Coffee & chat",
    status: "pending",
    category: "cancelled",
    date: "Wed 4 Jun · 11:00",
    price: "€45",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face",
  },
  {
    id: "3",
    chatId: "tom",
    name: "Tom B.",
    activity: "Event companion",
    status: "pending",
    category: "upcoming",
    date: "Sun 8 Jun · 15:00",
    price: "€130",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face",
  },
  {
    id: "6",
    chatId: "julia",
    name: "Julia P.",
    activity: "City walk",
    status: "confirmed",
    category: "completed",
    date: "Sat 31 May · 16:00",
    price: "€55",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=96&h=96&fit=crop&crop=face",
  },
]

export type FeedItem =
  | { kind: "request"; data: ProviderRequest }
  | { kind: "booking"; data: ProviderBooking }

/** Mixed feed for the All tab — requests and bookings interleaved. */
export const PROVIDER_ALL_FEED: FeedItem[] = [
  { kind: "request", data: PROVIDER_REQUESTS[0] },
  { kind: "booking", data: PROVIDER_BOOKINGS[0] },
  { kind: "booking", data: PROVIDER_BOOKINGS[1] },
  { kind: "request", data: PROVIDER_REQUESTS[1] },
  { kind: "booking", data: PROVIDER_BOOKINGS[2] },
  { kind: "booking", data: PROVIDER_BOOKINGS[3] },
  { kind: "request", data: PROVIDER_REQUESTS[2] },
  { kind: "booking", data: PROVIDER_BOOKINGS[4] },
  { kind: "booking", data: PROVIDER_BOOKINGS[5] },
]

export const PROVIDER_FEED_TAB_COUNTS = {
  all: PROVIDER_ALL_FEED.length,
  requests: PROVIDER_REQUESTS.length,
  upcoming: PROVIDER_BOOKINGS.filter((booking) => booking.category === "upcoming").length,
  completed: PROVIDER_BOOKINGS.filter((booking) => booking.category === "completed").length,
  cancelled: PROVIDER_BOOKINGS.filter((booking) => booking.category === "cancelled").length,
} as const

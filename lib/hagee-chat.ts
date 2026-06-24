export type HageeChatPreview = {
  id: string
  name: string
  avatar: string
  preview: string
  time: string
  unreadCount?: number
  online?: boolean
  unread?: boolean
}

export type HageeChatMessage =
  | { type: "incoming"; text: string; time: string }
  | { type: "outgoing"; text: string; time: string }

export type HageeChatThread = {
  id: string
  name: string
  avatar: string
  status: string
  messages: HageeChatMessage[]
}

export const HAGEE_CHAT_PREVIEWS: HageeChatPreview[] = [
  {
    id: "sophie",
    name: "Sophie M.",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    preview: "That sounds wonderful, I'd love to!",
    time: "2m ago",
    unreadCount: 2,
    online: true,
    unread: true,
  },
  {
    id: "sarah",
    name: "Sarah L.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    preview: "See you tonight at De Kas! 🌿",
    time: "1h ago",
  },
  {
    id: "elena",
    name: "Elena R.",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    preview: "I'm free Thursday evening if that wor…",
    time: "3h ago",
    unreadCount: 1,
    online: true,
    unread: true,
  },
  {
    id: "maya",
    name: "Maya S.",
    avatar:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80",
    preview: "You: Looking forward to it 😊",
    time: "Yesterday",
  },
  {
    id: "isabella",
    name: "Isabella K.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    preview: "It was such a great evening, thank you!",
    time: "Mon",
  },
]

export const HAGEE_CHAT_THREADS: Record<string, HageeChatThread> = {
  sophie: {
    id: "sophie",
    name: "Sophie M.",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    status: "Online",
    messages: [
      { type: "incoming", text: "Would you be up for the Rijksmuseum this week?", time: "18:10" },
      { type: "outgoing", text: "That sounds wonderful, I'd love to!", time: "18:24" },
    ],
  },
  sarah: {
    id: "sarah",
    name: "Sarah L.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    status: "Online · Dinner tonight",
    messages: [
      { type: "incoming", text: "Table is booked for 19:00", time: "16:02" },
      { type: "incoming", text: "See you tonight at De Kas! 🌿", time: "16:03" },
    ],
  },
  elena: {
    id: "elena",
    name: "Elena R.",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    status: "Online",
    messages: [
      { type: "incoming", text: "I'm free Thursday evening if that works for you?", time: "14:40" },
    ],
  },
  maya: {
    id: "maya",
    name: "Maya S.",
    avatar:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80",
    status: "Last seen yesterday",
    messages: [
      { type: "incoming", text: "Can't wait for Saturday!", time: "11:20" },
      { type: "outgoing", text: "Looking forward to it 😊", time: "11:35" },
    ],
  },
  isabella: {
    id: "isabella",
    name: "Isabella K.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    status: "Completed · Mon",
    messages: [
      { type: "incoming", text: "It was such a great evening, thank you!", time: "22:10" },
    ],
  },
}

export function getHageeChatThread(id: string): HageeChatThread | undefined {
  return HAGEE_CHAT_THREADS[id]
}

export const HAGEE_CONNECTIONS_BOOKINGS = [
  {
    id: "sarah-dinner",
    title: "Dinner with Sarah",
    date: "Tonight, 19:00",
    status: "Confirmed",
  },
  {
    id: "maya-walk",
    title: "City walk with Maya",
    date: "Sat, 14:00",
    status: "Pending",
  },
]

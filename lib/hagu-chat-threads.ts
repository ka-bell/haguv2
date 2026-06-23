export type ChatMessage =
  | { type: "incoming"; text: string; time: string }
  | { type: "outgoing"; text: string; time: string }

export type ChatThread = {
  id: string
  name: string
  avatar: string
  status: string
  bookingBar?: {
    activity: string
    date: string
    price: string
  }
  messages: ChatMessage[]
}

export const CHAT_THREADS: Record<string, ChatThread> = {
  luca: {
    id: "luca",
    name: "Luca M.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
    status: "Online · Booking Fri 6 Jun",
    bookingBar: { activity: "Dinner for two", date: "Fri 6 Jun", price: "€95" },
    messages: [
      { type: "incoming", text: "Hey Sarah! Really looking forward to Friday 😊", time: "18:32" },
      { type: "incoming", text: "Do you have a preference for a restaurant?", time: "18:33" },
      {
        type: "outgoing",
        text: "Hi Luca! Me too 🙌 I know a great spot in De Pijp — Brasserie Bark!",
        time: "18:45",
      },
      {
        type: "outgoing",
        text: "I'll make a reservation for 19:15 to give us some buffer 😊",
        time: "18:46",
      },
      { type: "incoming", text: "Perfect! See you there 🍷", time: "18:50" },
    ],
  },
  emma: {
    id: "emma",
    name: "Emma K.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face",
    status: "Online · Booking Sat 7 Jun",
    bookingBar: { activity: "Cuddling session", date: "Sat 7 Jun", price: "€60" },
    messages: [
      { type: "incoming", text: "Hi! Just confirming Saturday at 20:00 still works for you?", time: "14:12" },
      { type: "outgoing", text: "Yes, perfect! See you then 😊", time: "14:20" },
    ],
  },
  tom: {
    id: "tom",
    name: "Tom B.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face",
    status: "Last seen 2h ago · Booking Sun 8 Jun",
    bookingBar: { activity: "Event companion", date: "Sun 8 Jun", price: "€130" },
    messages: [
      { type: "incoming", text: "The event starts at 15:00 — should we meet at the entrance?", time: "10:05" },
      { type: "outgoing", text: "Sounds good! I'll be there 10 minutes early.", time: "10:18" },
    ],
  },
  sofia: {
    id: "sofia",
    name: "Sofia R.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=face",
    status: "Completed · Mon 2 Jun",
    bookingBar: { activity: "Museum visit", date: "Mon 2 Jun", price: "€75" },
    messages: [
      { type: "outgoing", text: "Thanks again for a lovely afternoon!", time: "16:40" },
      { type: "incoming", text: "Had a great time — hope to book again soon 🙌", time: "17:02" },
    ],
  },
  mark: {
    id: "mark",
    name: "Mark D.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face",
    status: "Cancelled · Wed 4 Jun",
    bookingBar: { activity: "Coffee & chat", date: "Wed 4 Jun", price: "€45" },
    messages: [
      { type: "incoming", text: "Sorry, something came up — can we reschedule?", time: "09:14" },
      { type: "outgoing", text: "No worries, thanks for letting me know.", time: "09:22" },
    ],
  },
  julia: {
    id: "julia",
    name: "Julia P.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=96&h=96&fit=crop&crop=face",
    status: "Completed · Sat 31 May",
    bookingBar: { activity: "City walk", date: "Sat 31 May", price: "€55" },
    messages: [
      { type: "incoming", text: "That walk was exactly what I needed — thank you!", time: "18:10" },
      { type: "outgoing", text: "So glad you enjoyed it 😊", time: "18:25" },
    ],
  },
}

export function getChatThread(id: string): ChatThread | undefined {
  return CHAT_THREADS[id]
}

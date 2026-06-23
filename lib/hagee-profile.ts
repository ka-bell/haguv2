export type HageeProfile = {
  firstName: string
  age: number
  bio: string
  coverImage: string
  visible: boolean
  traits: { emoji: string; label: string }[]
  interests: { emoji: string; label: string; selected: boolean }[]
  photos: string[]
  stats: {
    meetups: number
    responseRate: string
    badges: number
  }
}

export const HAGEE_PROFILE: HageeProfile = {
  firstName: "Alex",
  age: 29,
  bio: '"Probably overthinking something right now. Loves long dinners, bad films, and conversations that go nowhere useful."',
  coverImage:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  visible: true,
  traits: [
    { emoji: "🌙", label: "Night owl" },
    { emoji: "🧠", label: "Overthinker" },
    { emoji: "😂", label: "Dry humour" },
    { emoji: "📚", label: "Deep diver" },
  ],
  interests: [
    { emoji: "🎬", label: "Film", selected: true },
    { emoji: "🍷", label: "Wine", selected: true },
    { emoji: "🧠", label: "Philosophy", selected: true },
    { emoji: "🏃", label: "Running", selected: false },
    { emoji: "📖", label: "Literature", selected: false },
    { emoji: "🎵", label: "Music", selected: false },
  ],
  photos: [
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
  ],
  stats: {
    meetups: 8,
    responseRate: "94%",
    badges: 3,
  },
}

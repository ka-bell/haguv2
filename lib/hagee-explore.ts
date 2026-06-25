export type HageeExploreMatch = {
  id: string
  name: string
  age: number
  photo: string
  rating: number
  verified: boolean
  availabilityLabel: string
  tagline: string
  responseTime: string
  vibeTags: string[]
  interests: string[]
  activities: string[]
}

export const HAGEE_EXPLORE_MATCHES: HageeExploreMatch[] = [
  {
    id: "elena",
    name: "Elena",
    age: 29,
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    rating: 4.9,
    verified: true,
    availabilityLabel: "Available tonight",
    tagline: "Great listener · Loves deep conversations",
    responseTime: "Responds within a few hours",
    vibeTags: ["Deep talk", "Calm", "Wine", "Top rated"],
    interests: ["Wine", "Philosophy", "Psychology", "Cooking", "Film"],
    activities: ["meal", "conversation"],
  },
  {
    id: "sara",
    name: "Sara",
    age: 31,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    rating: 4.8,
    verified: true,
    availabilityLabel: "Available today",
    tagline: "Curious mind · Long dinners, no agenda",
    responseTime: "Responds within a few hours",
    vibeTags: ["Film", "Philosophy", "Night owl"],
    interests: ["Film", "Philosophy", "Wine", "Restaurants", "Literature"],
    activities: ["meal", "outing"],
  },
  {
    id: "luca",
    name: "Luca",
    age: 29,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
    rating: 4.7,
    verified: true,
    availabilityLabel: "Available this week",
    tagline: "City walks · Spontaneous plans",
    responseTime: "Usually replies same day",
    vibeTags: ["Coffee", "Walks", "Spontaneous"],
    interests: ["Coffee", "Running", "Philosophy", "Cycling"],
    activities: ["conversation", "outing"],
  },
  {
    id: "mila",
    name: "Mila",
    age: 27,
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80",
    rating: 4.9,
    verified: true,
    availabilityLabel: "Available tonight",
    tagline: "Art lover · Thoughtful and warm",
    responseTime: "Responds within an hour",
    vibeTags: ["Art", "Wine", "Calm"],
    interests: ["Art galleries", "Wine", "Film", "Photography", "Cooking"],
    activities: ["meal", "outing"],
  },
]

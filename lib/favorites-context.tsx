"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface HaguProvider {
  id: string
  name: string
  age: number
  location: string
  availability: string
  verified: boolean
  images: string[]
  about: string
  services: {
    category: string
    items: string[]
  }[]
  isLiked: boolean
}

const initialProviders: HaguProvider[] = [
  {
    id: "1",
    name: "Linda S.",
    age: 23,
    location: "HAGU at Amsterdam area",
    availability: "Available: 28.03.24",
    verified: true,
    images: [
      "/woman-dog-park.png",
      "/cozy-living-room-pets.png",
      "/woman-cooking-kitchen.png",
      "/woman-reading-cat.png",
      "/garden-pets.png",
    ],
    about: "Lorem ipsum dolor sit amet consectetur. Suspendisse feugiat nisl imperdiet quam. Sed ipsum et rutrum non.",
    services: [
      { category: "Hugging", items: ["TV watching", "Back scratching"] },
      { category: "Cooking", items: ["Lunch", "Breakfast"] },
      { category: "Friendly", items: ["Cleaning", "Grooming"] },
    ],
    isLiked: false,
  },
  {
    id: "2",
    name: "Emma K.",
    age: 28,
    location: "HAGU at Rotterdam area",
    availability: "Available: 29.03.24",
    verified: true,
    images: ["/young-woman-golden-retriever.png", "/placeholder-hxvrn.png", "/woman-walking-dogs-city.png"],
    about: "Passionate pet lover with 5 years of experience. I treat every pet like my own family member.",
    services: [
      { category: "Walking", items: ["Long walks", "Park visits"] },
      { category: "Care", items: ["Feeding", "Medication"] },
    ],
    isLiked: false,
  },
  {
    id: "3",
    name: "Max R.",
    age: 31,
    location: "HAGU at Utrecht area",
    availability: "Available: 30.03.24",
    verified: false,
    images: ["/man-playing-dogs.png", "/backyard-agility.png", "/placeholder-fgepw.png", "/cozy-home-office-pets.png"],
    about: "Professional dog trainer offering personalized care and training sessions for your beloved pets.",
    services: [
      { category: "Training", items: ["Basic commands", "Behavioral training"] },
      { category: "Exercise", items: ["Running", "Agility training"] },
      { category: "Grooming", items: ["Brushing", "Nail trimming"] },
    ],
    isLiked: false,
  },
]

interface FavoritesContextType {
  providers: HaguProvider[]
  toggleFavorite: (providerId: string) => void
  getFavoriteProviders: () => HaguProvider[]
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [providers, setProviders] = useState<HaguProvider[]>(initialProviders)

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("hagu-favorites")
    if (savedFavorites) {
      try {
        const favoriteIds = JSON.parse(savedFavorites)
        setProviders((prev) =>
          prev.map((provider) => ({
            ...provider,
            isLiked: favoriteIds.includes(provider.id),
          })),
        )
      } catch (error) {
        console.error("Error loading favorites:", error)
      }
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    const favoriteIds = providers.filter((p) => p.isLiked).map((p) => p.id)
    localStorage.setItem("hagu-favorites", JSON.stringify(favoriteIds))
  }, [providers])

  const toggleFavorite = (providerId: string) => {
    setProviders((prev) =>
      prev.map((provider) => (provider.id === providerId ? { ...provider, isLiked: !provider.isLiked } : provider)),
    )
  }

  const getFavoriteProviders = () => {
    return providers.filter((provider) => provider.isLiked)
  }

  return (
    <FavoritesContext.Provider value={{ providers, toggleFavorite, getFavoriteProviders }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}

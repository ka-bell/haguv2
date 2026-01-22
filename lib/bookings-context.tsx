"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Booking {
  id: number
  name: string
  age: number
  status: string
  needsPayment: boolean
  services: string[]
  dateTime: string
  location: string
  totalPrice: number
  createdAt: string
}

interface BookingsContextType {
  bookings: Booking[]
  addBooking: (booking: Omit<Booking, "id" | "createdAt">) => void
  hasNewBookings: boolean
  markBookingsAsViewed: () => void
}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined)

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      name: "Linda L.",
      age: 23,
      status: "Booking confirmed",
      needsPayment: true,
      services: ["TV watching", "Hugging"],
      dateTime: "01.02.2023 14:00 - 15:30",
      location: "My place",
      totalPrice: 98,
      createdAt: "2024-01-01T10:00:00Z",
    },
    {
      id: 2,
      name: "Name L.",
      age: 34,
      status: "Booking confirmed",
      needsPayment: false,
      services: ["Back scratching"],
      dateTime: "02.02.2023 16:00 - 17:00",
      location: "Hagu's place",
      totalPrice: 120,
      createdAt: "2024-01-02T10:00:00Z",
    },
    {
      id: 3,
      name: "Name L.",
      age: 42,
      status: "Booking pending",
      needsPayment: false,
      services: ["Reading"],
      dateTime: "03.02.2023 10:00 - 11:00",
      location: "In public",
      totalPrice: 75,
      createdAt: "2024-01-03T10:00:00Z",
    },
    {
      id: 4,
      name: "Name L.",
      age: 29,
      status: "Booking confirmed",
      needsPayment: false,
      services: ["Cooking"],
      dateTime: "04.02.2023 12:00 - 13:00",
      location: "My place",
      totalPrice: 95,
      createdAt: "2024-01-04T10:00:00Z",
    },
  ])

  const [hasNewBookings, setHasNewBookings] = useState(false)

  // Load bookings from localStorage on mount
  useEffect(() => {
    const savedBookings = localStorage.getItem("hagu-bookings")
    const savedHasNew = localStorage.getItem("hagu-has-new-bookings")

    if (savedBookings) {
      setBookings(JSON.parse(savedBookings))
    }

    if (savedHasNew) {
      setHasNewBookings(JSON.parse(savedHasNew))
    }
  }, [])

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("hagu-bookings", JSON.stringify(bookings))
  }, [bookings])

  // Save hasNewBookings to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("hagu-has-new-bookings", JSON.stringify(hasNewBookings))
  }, [hasNewBookings])

  const addBooking = (bookingData: Omit<Booking, "id" | "createdAt">) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now(), // Simple ID generation
      createdAt: new Date().toISOString(),
    }

    setBookings((prev) => [newBooking, ...prev])
    setHasNewBookings(true)
  }

  const markBookingsAsViewed = () => {
    setHasNewBookings(false)
  }

  return (
    <BookingsContext.Provider value={{ bookings, addBooking, hasNewBookings, markBookingsAsViewed }}>
      {children}
    </BookingsContext.Provider>
  )
}

export function useBookings() {
  const context = useContext(BookingsContext)
  if (context === undefined) {
    throw new Error("useBookings must be used within a BookingsProvider")
  }
  return context
}

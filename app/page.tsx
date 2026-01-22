"use client"

import type React from "react"

import { Heart, X, Calendar } from "lucide-react"
import { useState, useRef } from "react"
import { useFavorites } from "@/lib/favorites-context"
import BottomNavigation from "@/components/bottom-navigation"

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

const providersData: HaguProvider[] = [
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

export default function ExploreHagu() {
  const { providers, toggleFavorite } = useFavorites()
  const [currentProviderIndex, setCurrentProviderIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [panelPosition, setPanelPosition] = useState(0) // 0 = collapsed, 1 = expanded
  const [panelDragStart, setPanelDragStart] = useState<number | null>(null)
  const [panelDragOffset, setPanelDragOffset] = useState(0)
  const [isPanelDragging, setIsPanelDragging] = useState(false)
  const [swipingCardId, setSwipingCardId] = useState<string | null>(null)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const [isEntering, setIsEntering] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const getVisibleProviders = () => {
    const visible = []
    for (let i = 0; i < 3; i++) {
      const index = (currentProviderIndex + i) % providers.length
      visible.push({ ...providers[index], stackIndex: i })
    }
    return visible
  }

  const visibleProviders = getVisibleProviders()
  const currentProvider = visibleProviders[0]

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || isPanelDragging) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const halfWidth = rect.width / 2

    // Check if this was a drag/swipe gesture (movement > 10px)
    const dragDistance = Math.sqrt(dragOffset.x ** 2 + dragOffset.y ** 2)
    if (dragDistance > 10) return

    if (clickX < halfWidth) {
      // Clicked left side - previous image
      if (currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1)
      }
    } else {
      // Clicked right side - next image
      if (currentImageIndex < currentProvider.images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1)
      }
    }
  }

  const handlePanelStart = (clientY: number) => {
    setPanelDragStart(clientY)
    setIsPanelDragging(true)
  }

  const handlePanelMove = (clientY: number) => {
    if (panelDragStart === null || !isPanelDragging) return
    const delta = panelDragStart - clientY
    setPanelDragOffset(delta)
  }

  const handlePanelEnd = () => {
    if (panelDragStart === null || !isPanelDragging) return

    const threshold = 50

    if (panelDragOffset > threshold) {
      setPanelPosition(1)
    } else if (panelDragOffset < -threshold) {
      setPanelPosition(0)
    }

    setPanelDragStart(null)
    setPanelDragOffset(0)
    setIsPanelDragging(false)
  }

  const getPanelTransform = () => {
    const positions = [40, 0]
    const basePosition = positions[panelPosition]
    const dragOffsetVh = typeof window !== "undefined" ? (panelDragOffset / window.innerHeight) * 100 : 0
    return basePosition - dragOffsetVh
  }

  const handleStart = (clientX: number, clientY: number) => {
    setDragStart({ x: clientX, y: clientY })
    setIsDragging(true)
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!dragStart || !isDragging) return

    const deltaX = clientX - dragStart.x
    const deltaY = clientY - dragStart.y
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleEnd = () => {
    if (!dragStart || !isDragging) return

    const threshold = 100
    const { x } = dragOffset

    if (Math.abs(x) > threshold) {
      if (x > 0) {
        handleLike()
      } else {
        handleNext()
      }
    } else {
      setDragOffset({ x: 0, y: 0 })
    }

    setDragStart(null)
    setIsDragging(false)
  }

  const handleNext = () => {
    setSwipingCardId(currentProvider.id)
    setSwipeDirection("left")
    setDragOffset({ x: 0, y: 0 })
    setIsEntering(true)

    setTimeout(() => {
      setCurrentProviderIndex((currentProviderIndex + 1) % providers.length)
      setCurrentImageIndex(0)
      setPanelPosition(0)
      setSwipingCardId(null)
      setSwipeDirection(null)
      setIsEntering(false)
    }, 300)
  }

  const handleLike = () => {
    toggleFavorite(currentProvider.id)
    setSwipingCardId(currentProvider.id)
    setSwipeDirection("right")
    setDragOffset({ x: 0, y: 0 })
    setIsEntering(true)

    setTimeout(() => {
      setCurrentProviderIndex((currentProviderIndex + 1) % providers.length)
      setCurrentImageIndex(0)
      setPanelPosition(0)
      setSwipingCardId(null)
      setSwipeDirection(null)
      setIsEntering(false)
    }, 300)
  }

  const handleHandlebarClick = () => {
    setPanelPosition(panelPosition === 0 ? 1 : 0)
  }

  const getCardTransform = (stackIndex: number, cardId: string) => {
    const isSwiping = swipingCardId === cardId

    if (isSwiping) {
      // Card is being swiped away
      const direction = swipeDirection === "left" ? -1 : 1
      return {
        x: direction * 150, // Exit distance in percentage
        y: 0,
        rotate: direction * 30,
        scale: 1,
        opacity: 0,
      }
    }

    if (stackIndex === 0 && isDragging) {
      // Top card being dragged
      return {
        x: dragOffset.x / 4, // Convert px to percentage-like value
        y: dragOffset.y / 4,
        rotate: dragOffset.x * 0.1,
        scale: 1,
        opacity: 1,
      }
    }

    // Cards in stack (not being interacted with)
    return {
      x: 0,
      y: 0, // All cards at same position
      rotate: 0,
      scale: 1, // All cards same size
      opacity: 1, // All cards fully opaque
    }
  }

  const renderProviderCard = (provider: HaguProvider & { stackIndex: number }) => {
    const { stackIndex } = provider
    const isTopCard = stackIndex === 0
    const isSwiping = swipingCardId === provider.id
    const transform = getCardTransform(stackIndex, provider.id)

    return (
      <div
        key={provider.id}
        className={`absolute inset-0 ${isSwiping ? "transition-all duration-300 ease-out" : ""}`}
        style={{
          transform: `translate(${transform.x}%, ${transform.y}px) rotate(${transform.rotate}deg) scale(${transform.scale})`,
          opacity: transform.opacity,
          zIndex: 10 - stackIndex,
          pointerEvents: isTopCard && !isSwiping ? "auto" : "none",
        }}
      >
        {/* Hero Image with Carousel */}
        <div
          className="absolute inset-0 bg-cover bg-center cursor-pointer"
          style={{ backgroundImage: `url(${provider.images[isTopCard ? currentImageIndex : 0]})` }}
          onClick={isTopCard ? handleImageClick : undefined}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

          {/* Available Today Badge */}
          <div className="absolute top-6 left-6">
            <div className="bg-hagu-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
              <Calendar className="w-4 h-4 text-hagu-heading" />
              <span className="text-sm font-medium text-hagu-heading">Available Today</span>
            </div>
          </div>

          {/* Service Tags */}
          <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
            {provider.services.slice(0, 3).map((service, index) => (
              <div key={index} className="bg-hagu-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-hagu-heading">{service.category}</span>
              </div>
            ))}
          </div>

          {/* Swipe indicators - only on top card */}
          {isTopCard && (isDragging || isSwiping) && (
            <>
              {(dragOffset.x > 50 || swipeDirection === "right") && (
                <div className="absolute inset-0 bg-hagu-accent/30 flex items-center justify-center">
                  <Heart className="w-20 h-20 text-hagu-primary fill-current" />
                </div>
              )}
              {(dragOffset.x < -50 || swipeDirection === "left") && (
                <div className="absolute inset-0 bg-hagu-error/20 flex items-center justify-center">
                  <X className="w-20 h-20 text-hagu-error" />
                </div>
              )}
            </>
          )}

          {/* Action Buttons - only on top card */}
          {isTopCard && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 right-6 flex flex-col gap-3 z-10 transition-all duration-400 ease-out`}
              style={{
                transform: isEntering ? "translateX(120px) translateY(-50%)" : "translateX(0) translateY(-50%)",
                opacity: isEntering ? 0 : 1, // Added opacity fade-in effect
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleLike()
                }}
                className="w-14 h-14 bg-hagu-accent rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Heart
                  className={`w-6 h-6 ${provider.isLiked ? "text-hagu-primary fill-current" : "text-hagu-primary"}`}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="w-14 h-14 bg-hagu-accent rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
              >
                <X className="w-6 h-6 text-hagu-heading" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel dots - only on top card */}
        {isTopCard && (
          <div
            className="absolute left-1/2 -translate-x-1/2 flex gap-1.5 z-30 transition-transform duration-300 ease-out pointer-events-none"
            style={{
              bottom: `calc(80vh - ${getPanelTransform()}vh + 10px)`,
            }}
          >
            {provider.images.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentImageIndex ? "bg-white w-6 shadow-lg" : "bg-white/70 w-1.5 shadow-md"
                }`}
              />
            ))}
          </div>
        )}

        {/* Profile Panel - only on top card */}
        {isTopCard && (
          <div
            ref={panelRef}
            className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl flex flex-col transition-transform duration-300 ease-out`}
            style={{
              transform: `translateY(${isPanelDragging ? getPanelTransform() : isEntering ? 100 : getPanelTransform()}vh)`,
              height: "80vh",
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
              handlePanelStart(e.clientY)
            }}
            onMouseMove={(e) => handlePanelMove(e.clientY)}
            onMouseUp={handlePanelEnd}
            onMouseLeave={handlePanelEnd}
            onTouchStart={(e) => {
              e.stopPropagation()
              handlePanelStart(e.touches[0].clientY)
            }}
            onTouchMove={(e) => handlePanelMove(e.touches[0].clientY)}
            onTouchEnd={handlePanelEnd}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2 cursor-pointer flex-shrink-0" onClick={handleHandlebarClick}>
              <div className="w-12 h-1 bg-hagu-border rounded-full" />
            </div>

            <div className="px-6 pb-28 overflow-y-auto flex-1 min-h-0">
              {/* Basic Info */}
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-hagu-heading mb-1">
                  {provider.name.split(" ")[0]} {provider.age}
                </h1>
                <p className="text-hagu-text text-base mb-1">{provider.location}</p>
                <p className="text-hagu-text-secondary text-sm italic">Sessions start at €80</p>
              </div>

              {/* About Section */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-hagu-heading mb-2">About</h2>
                <p className="text-hagu-text text-sm leading-relaxed">{provider.about}</p>
              </div>

              {/* Services Section */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-hagu-heading mb-3">Services</h2>
                <div className="space-y-3">
                  {provider.services.map((service, index) => (
                    <div key={index} className="bg-hagu-bg-light rounded-lg p-3">
                      <h3 className="font-semibold text-hagu-heading mb-2">{service.category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {service.items.map((item, itemIndex) => (
                          <span
                            key={itemIndex}
                            className="bg-hagu-accent text-hagu-heading text-xs px-3 py-1 rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-hagu-heading mb-2">Availability</h2>
                <p className="text-hagu-text text-sm">{provider.availability}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (!currentProvider) return null

  return (
    <div className="max-w-sm mx-auto bg-hagu-bg-light min-h-screen relative overflow-hidden">
      <div
        ref={cardRef}
        className="relative h-screen"
        onMouseDown={(e) => {
          if (!panelRef.current?.contains(e.target as Node) && !swipingCardId) {
            handleStart(e.clientX, e.clientY)
          }
        }}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => {
          if (!panelRef.current?.contains(e.target as Node) && !swipingCardId) {
            handleStart(e.touches[0].clientX, e.touches[0].clientY)
          }
        }}
        onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEnd}
      >
        {visibleProviders.reverse().map((provider) => renderProviderCard(provider))}
      </div>

      {/* Bottom navigation toolbar with high z-index */}
      <div className="absolute bottom-0 left-0 right-0 z-50">
        <BottomNavigation />
      </div>
    </div>
  )
}

"use client"

import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useFavorites } from "@/lib/favorites-context"

export default function FavoritesPage() {
  const { getFavoriteProviders } = useFavorites()
  const favoriteProviders = getFavoriteProviders()

  return (
    <div className="max-w-sm mx-auto bg-hagu-bg-light min-h-screen">
      {/* Header */}
      <div className="flex items-center px-6 py-4">
        <Link href="/" className="mr-4">
          <ArrowLeft className="w-6 h-6 text-hagu-heading" />
        </Link>
        <h1 className="text-2xl font-bold text-hagu-heading">Favorites</h1>
      </div>

      {/* Favorites Content */}
      <div className="px-6 pb-6">
        {favoriteProviders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Heart className="w-16 h-16 text-hagu-border mb-4" />
            <h2 className="text-xl font-semibold text-hagu-text-secondary mb-2">No favorites yet</h2>
            <p className="text-hagu-text-secondary text-center">
              Start exploring and heart the Hagu providers you like to see them here!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {favoriteProviders.map((provider) => (
              <div
                key={provider.id}
                className="bg-hagu-white rounded-lg overflow-hidden shadow-sm border border-hagu-border"
              >
                <div className="flex">
                  {/* Provider Image */}
                  <div
                    className="w-24 h-24 bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${provider.images[0]})` }}
                  />

                  {/* Provider Info */}
                  <div className="flex-1 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-hagu-heading">{provider.name}</h3>
                        <span className="text-hagu-text-secondary">{provider.age}</span>
                        {provider.verified && (
                          <div className="w-4 h-4 bg-hagu-accent rounded-full flex items-center justify-center">
                            <span className="text-hagu-primary text-xs font-bold">✓</span>
                          </div>
                        )}
                      </div>
                      <Heart className="w-5 h-5 text-hagu-primary fill-current" />
                    </div>

                    <p className="text-xs text-hagu-text-secondary mb-2">{provider.location}</p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-hagu-accent px-2 py-1 rounded-lg text-xs text-hagu-primary font-medium">
                        Hosting + Visiting
                      </span>
                      <span className="text-xs text-hagu-text-secondary">{provider.availability}</span>
                    </div>

                    <Link
                      href="/service-selection"
                      className="block w-full bg-hagu-primary text-hagu-white text-center py-2 rounded-lg text-sm font-medium hover:bg-hagu-primary/90 transition-colors"
                    >
                      Book HAGU
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

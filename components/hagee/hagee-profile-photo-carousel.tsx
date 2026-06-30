"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { cn } from "@/lib/utils"

type HageeProfilePhotoCarouselProps = {
  photos: string[]
  name: string
  className?: string
  overlay?: React.ReactNode
}

export function HageeProfilePhotoCarousel({
  photos,
  name,
  className,
  overlay,
}: HageeProfilePhotoCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: photos.length > 1, align: "start" })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  if (photos.length === 0) return null

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {photos.map((photo, index) => (
            <div key={`${photo}-${index}`} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-[4/5] max-h-[min(72vh,520px)] min-h-[360px] w-full">
                <Image
                  src={photo}
                  alt={index === 0 ? name : ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 448px) 100vw, 448px"
                  priority={index === 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

      {overlay ? <div className="pointer-events-none absolute inset-x-0 bottom-0">{overlay}</div> : null}

      {photos.length > 1 ? (
        <div className="absolute bottom-[5.5rem] left-0 right-0 flex justify-center gap-1.5">
          {photos.map((photo, index) => (
            <button
              key={`dot-${photo}-${index}`}
              type="button"
              aria-label={`Photo ${index + 1}`}
              onClick={() => emblaApi?.scrollTo(index)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === selectedIndex ? "w-5 bg-white" : "w-1.5 bg-white/45",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

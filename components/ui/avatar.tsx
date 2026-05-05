import * as React from "react"
import { cn } from "@/lib/utils"

type AvatarSize = "sm" | "md" | "lg"

const avatarSizeClass: Record<AvatarSize, string> = {
  sm: "size-8 text-xs",
  md: "size-12 text-sm",
  lg: "size-16 text-base",
}

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: AvatarSize
  online?: boolean
}

export function Avatar({ src, alt = "avatar", fallback = "?", size = "md", online = false, className, ...props }: AvatarProps) {
  return (
    <div className={cn("relative inline-flex shrink-0 items-center justify-center", className)} {...props}>
      <div
        className={cn(
          "overflow-hidden rounded-full border-2 border-[#FEFFFF] bg-[#D0F1F0] text-[#2D1012] ring-1 ring-black/5",
          avatarSizeClass[size],
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center font-semibold">{fallback}</span>
        )}
      </div>
      {online ? <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#FEFFFF] bg-[#D0F1F0]" /> : null}
    </div>
  )
}

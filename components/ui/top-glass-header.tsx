import { cn } from "@/lib/utils"

interface TopGlassHeaderProps {
  title?: string
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
  className?: string
}

export function TopGlassHeader({ title = "HAGU", leftSlot, rightSlot, className }: TopGlassHeaderProps) {
  return (
    <header className={cn("flex w-full items-center justify-between py-4", className)}>
      {leftSlot ? (
        <div className="flex size-11 items-center justify-center rounded-full border border-[#D0F1F0]/60 bg-white/30 backdrop-blur-xl">
          {leftSlot}
        </div>
      ) : (
        <div className="size-11" aria-hidden="true" />
      )}

      <div className="rounded-full border border-[#D0F1F0]/60 bg-white/30 px-8 py-2 backdrop-blur-xl">
        <span className="text-[32px] font-bold leading-none tracking-tight text-[#2D1012]">{title}</span>
      </div>

      {rightSlot ? (
        <div className="flex size-11 items-center justify-center rounded-full border border-[#D0F1F0]/60 bg-white/30 backdrop-blur-xl">
          {rightSlot}
        </div>
      ) : (
        <div className="size-11" aria-hidden="true" />
      )}
    </header>
  )
}

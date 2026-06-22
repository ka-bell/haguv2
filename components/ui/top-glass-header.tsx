import { cn } from "@/lib/utils"

interface TopGlassHeaderProps {
  title?: string
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
  className?: string
}

function GlassChrome({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-[45px] items-center justify-center rounded-[32px] border border-[#D0F1F0]/30 bg-white/20 px-[15px] backdrop-blur-[20px]",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function TopGlassHeader({ title = "HAGU", leftSlot, rightSlot, className }: TopGlassHeaderProps) {
  return (
    <header className={cn("flex w-full items-center justify-center gap-[50px] pl-2.5", className)}>
      {leftSlot ? (
        <GlassChrome className="w-[46px]">{leftSlot}</GlassChrome>
      ) : (
        <div className="w-[46px]" aria-hidden="true" />
      )}

      <GlassChrome className="w-[147px] px-1">
        <span className="text-lg font-bold tracking-tight text-[#2D1012]">{title}</span>
      </GlassChrome>

      {rightSlot ? (
        <GlassChrome className="w-[52px]">{rightSlot}</GlassChrome>
      ) : (
        <div className="w-[52px]" aria-hidden="true" />
      )}
    </header>
  )
}

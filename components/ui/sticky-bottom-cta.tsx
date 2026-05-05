import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface StickyBottomCtaProps {
  label: string
  className?: string
}

export function StickyBottomCta({ label, className }: StickyBottomCtaProps) {
  return (
    <div className={cn("fixed bottom-5 left-1/2 z-40 w-[340px] -translate-x-1/2", className)}>
      <Button size="lg" className="w-full text-base font-semibold">
        {label}
      </Button>
    </div>
  )
}

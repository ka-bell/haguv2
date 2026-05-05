import * as React from "react"
import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-3xl border border-black/5 bg-[#FEFFFF] p-5 shadow-[0px_8px_24px_rgba(26,26,30,0.06)]", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={cn("text-lg font-semibold text-[#2D1012]", className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-[#8a8a96]", className)} {...props} />
}

export { Card, CardTitle, CardDescription }

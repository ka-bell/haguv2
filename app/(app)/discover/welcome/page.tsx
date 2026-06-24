import { redirect } from "next/navigation"
import { ROUTES } from "@/lib/routes"

export default function DiscoverWelcomePage() {
  redirect(ROUTES.home)
}

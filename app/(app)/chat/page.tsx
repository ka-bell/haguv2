import { redirect } from "next/navigation"
import { ROUTES } from "@/lib/routes"

export default function ChatPage() {
  redirect(ROUTES.chatThread("luca"))
}

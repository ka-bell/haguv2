import { HaguChatThread } from "@/components/hagu/hagu-chat-thread"

export default async function ChatThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <HaguChatThread threadId={id} />
}

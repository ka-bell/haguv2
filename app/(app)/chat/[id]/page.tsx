import { ChatThreadPageClient } from "./chat-thread-client"

export default async function ChatThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ChatThreadPageClient threadId={id} />
}

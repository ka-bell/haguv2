"use client"

import { useState } from "react"
import { ChevronLeft, Heart, Send } from "lucide-react"
import Link from "next/link"

export default function ChatDetailPage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState("")
  const [messages] = useState([
    {
      id: 1,
      sender: "Hagu L.",
      time: "17:15",
      content:
        "Lorem ipsum dolor sit amet consectetur. Suspendisse feugiat nisl imperdiet quam. Sed ipsum et rutrum non.",
      isOwn: false,
    },
    {
      id: 2,
      sender: "Hagee L.",
      time: "17:34",
      content: "Lorem ipsum dolor sit amet consectetur.",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Hagu L.",
      time: "17:45",
      content: "Lorem ipsum dolor sit amet",
      isOwn: false,
    },
  ])

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage("")
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f2f2f2" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b" style={{ borderColor: "#e0e0e0" }}>
        <Link href="/chat">
          <ChevronLeft className="w-6 h-6" style={{ color: "#2d1012" }} />
        </Link>
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
            style={{ borderColor: "#e0e0e0" }}
          >
            <svg className="w-5 h-5" style={{ color: "#828282" }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-lg" style={{ color: "#2d1012" }}>
              Name L.
            </h2>
            <span className="text-sm" style={{ color: "#034123" }}>
              Online
            </span>
          </div>
        </div>
        <Heart className="w-6 h-6" style={{ color: "#2d1012" }} />
      </div>

      {/* Booking Info */}
      <div className="px-6 py-4 bg-white border-b" style={{ borderColor: "#e0e0e0" }}>
        <p className="font-semibold" style={{ color: "#2d1012" }}>
          01.02.2023 14:00 - 15:30
        </p>
        <p className="text-sm" style={{ color: "#828282" }}>
          Booking confirmed
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${msg.isOwn ? "bg-white" : "bg-white"}`}
              style={{ backgroundColor: msg.isOwn ? "#d0f1f0" : "white" }}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-sm" style={{ color: "#2d1012" }}>
                  {msg.sender}
                </span>
                <span className="text-xs" style={{ color: "#828282" }}>
                  {msg.time}
                </span>
              </div>
              <p className="text-sm" style={{ color: "#333333" }}>
                {msg.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 bg-white border-t" style={{ borderColor: "#e0e0e0" }}>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type here..."
            className="flex-1 px-4 py-3 rounded-full border focus:outline-none focus:ring-2"
            style={{
              borderColor: "#e0e0e0",
              focusRingColor: "#d0f1f0",
            }}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#d0f1f0" }}
          >
            <Send className="w-5 h-5" style={{ color: "#034123" }} />
          </button>
        </div>
      </div>
    </div>
  )
}

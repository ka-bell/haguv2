"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function ChatPage() {
  const [connections] = useState([
    {
      id: "sam-b",
      name: "Sam B.",
      age: 23,
      status: "Online",
      hasNotification: true,
    },
    {
      id: "name-l-34",
      name: "Name L.",
      age: 34,
      status: "Online",
      hasNotification: false,
    },
    {
      id: "name-l-42",
      name: "Name L.",
      age: 42,
      status: "Offline",
      hasNotification: false,
    },
    {
      id: "name-l-29",
      name: "Name L.",
      age: 29,
      status: "Offline",
      hasNotification: false,
    },
  ])

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f2f2f2" }}>
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold" style={{ color: "#2d1012" }}>
          Connections
        </h1>
      </div>

      {/* Connections List */}
      <div className="px-6 space-y-4">
        {connections.map((connection) => (
          <Link key={connection.id} href={`/chat/${connection.id}`} className="block">
            <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: "#e0e0e0" }}>
              <div className="flex items-center space-x-4">
                <div
                  className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: "#e0e0e0" }}
                >
                  <svg className="w-6 h-6" style={{ color: "#828282" }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-lg" style={{ color: "#2d1012" }}>
                      {connection.name}
                    </span>
                    <span className="text-lg" style={{ color: "#828282" }}>
                      {connection.age}
                    </span>
                  </div>
                  <span className="text-sm" style={{ color: connection.status === "Online" ? "#034123" : "#828282" }}>
                    {connection.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {connection.hasNotification && (
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                )}
                <ChevronRight className="w-5 h-5" style={{ color: "#828282" }} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

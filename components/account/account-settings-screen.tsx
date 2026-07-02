"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import {
  getAccountEmail,
  HAGEE_DEFAULT_ACCOUNT_EMAIL,
  setAccountEmail,
} from "@/lib/account-settings-storage"
import { HAGU_PROVIDER_PROFILE } from "@/lib/hagu-provider-profile"
import { getSession } from "@/lib/session"
import { cn } from "@/lib/utils"

type SaveMessage = { type: "email" | "password"; text: string } | null

function defaultEmailForRole(): string {
  const role = getSession().role
  return role === "hagu" ? HAGU_PROVIDER_PROFILE.email : HAGEE_DEFAULT_ACCOUNT_EMAIL
}

export function AccountSettingsScreen() {
  const [email, setEmail] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [emailPassword, setEmailPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState<SaveMessage>(null)

  useEffect(() => {
    setEmail(getAccountEmail(defaultEmailForRole()))
  }, [])

  const handleEmailSave = () => {
    if (!newEmail.trim() || !emailPassword.trim()) {
      setMessage({ type: "email", text: "Enter a new email and your current password." })
      return
    }
    if (!newEmail.includes("@")) {
      setMessage({ type: "email", text: "Enter a valid email address." })
      return
    }

    setAccountEmail(newEmail)
    setEmail(newEmail.trim())
    setNewEmail("")
    setEmailPassword("")
    setMessage({ type: "email", text: "Email updated. We sent a confirmation link to your new address." })
  }

  const handlePasswordSave = () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setMessage({ type: "password", text: "Fill in all password fields." })
      return
    }
    if (newPassword.length < 6) {
      setMessage({ type: "password", text: "New password must be at least 6 characters." })
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "password", text: "New passwords do not match." })
      return
    }

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setMessage({ type: "password", text: "Password updated successfully." })
  }

  return (
    <div className="space-y-6 pb-4">
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.5px] text-[#1A1A1E]">Email & password</h1>
        <p className="mt-1 text-sm text-[#8A8A96]">Update how you sign in to HAGU.</p>
      </div>

      <section className="hagu-surface-card space-y-4 p-5">
        <div>
          <p className="hagu-section-label">Email address</p>
          <p className="mt-1 text-[13px] text-hagu-text-secondary">Current: {email}</p>
        </div>

        <Input
          label="New email address"
          type="email"
          value={newEmail}
          onChange={(event) => setNewEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Input
          label="Current password"
          type="password"
          value={emailPassword}
          onChange={(event) => setEmailPassword(event.target.value)}
          placeholder="Confirm with your password"
          autoComplete="current-password"
        />

        {message?.type === "email" ? (
          <p
            className={cn(
              "text-[13px]",
              message.text.includes("updated") ? "text-[#3DA89E]" : "text-[#DC3232]",
            )}
          >
            {message.text}
          </p>
        ) : null}

        <button type="button" onClick={handleEmailSave} className="hagu-action-btn-dark w-full">
          Update email
        </button>
      </section>

      <section className="hagu-surface-card space-y-4 p-5">
        <p className="hagu-section-label">Password</p>

        <Input
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          autoComplete="current-password"
        />
        <Input
          label="New password"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />
        <Input
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
        />

        {message?.type === "password" ? (
          <p
            className={cn(
              "text-[13px]",
              message.text.includes("updated") ? "text-[#3DA89E]" : "text-[#DC3232]",
            )}
          >
            {message.text}
          </p>
        ) : null}

        <button type="button" onClick={handlePasswordSave} className="hagu-action-btn-dark w-full">
          Update password
        </button>
      </section>
    </div>
  )
}

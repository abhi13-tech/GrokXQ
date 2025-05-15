"use client"

import { useEffect, useState } from "react"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { UpdatePasswordForm } from "@/components/auth/update-password-form"

export default function ResetPasswordPage() {
  const [isResetMode, setIsResetMode] = useState(true)

  useEffect(() => {
    // Check if we have a hash fragment in the URL (from the reset link)
    const hash = window.location.hash
    if (hash && hash.includes("access_token") && hash.includes("type=recovery")) {
      setIsResetMode(false)
    }
  }, [])

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <div className="w-full max-w-md">{isResetMode ? <ResetPasswordForm /> : <UpdatePasswordForm />}</div>
    </div>
  )
}

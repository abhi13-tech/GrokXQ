"use client"

import { useDefault } from "@/contexts/default-context"
import { redirect } from "next/navigation"

export default function Dashboard() {
  const { user, profile } = useDefault()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {profile?.name || user?.email}!</p>
      {profile?.imageUrl && (
        <img src={profile.imageUrl || "/placeholder.svg"} alt="Profile" className="rounded-full w-32 h-32 mt-4" />
      )}
    </div>
  )
}

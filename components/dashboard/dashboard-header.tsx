"use client"

import { useAuth } from "@/contexts/auth-context"
import { ConnectionStatusIndicator } from "@/components/connection-status-indicator"

export function DashboardHeader() {
  const { user, profile } = useAuth()

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome, {profile?.full_name || user?.email?.split("@")[0] || "User"}
        </h2>
        <p className="text-muted-foreground">Here's an overview of your AI development activities</p>
      </div>
      <ConnectionStatusIndicator />
    </div>
  )
}

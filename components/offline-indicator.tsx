"use client"
import { WifiOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function OfflineIndicator() {
  const { isOffline } = useAuth()

  if (!isOffline) return null

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md shadow-md flex items-center gap-2 z-50">
      <WifiOff className="h-4 w-4" />
      <span>You are offline</span>
    </div>
  )
}

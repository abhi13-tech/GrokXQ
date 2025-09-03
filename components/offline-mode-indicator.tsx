"use client"

import { CloudOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function OfflineModeIndicator() {
  const { isOfflineMode, disableOfflineMode } = useAuth()

  if (!isOfflineMode) {
    return null
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100 hover:text-amber-950"
            onClick={disableOfflineMode}
          >
            <CloudOff className="h-4 w-4" />
            <span className="hidden md:inline">Offline Mode</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>You're using the app in offline mode. Click to exit offline mode.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

type ApiStatus = "available" | "unavailable" | "unknown"

interface ApiStatusInfo {
  groq: ApiStatus
  xai: ApiStatus
  lastChecked: Date | null
}

export function ApiStatusIndicator() {
  const [status, setStatus] = useState<ApiStatusInfo>({
    groq: "unknown",
    xai: "unknown",
    lastChecked: null,
  })

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Check Groq API status
        const groqStatus = process.env.GROQ_API_KEY ? "available" : "unavailable"

        // Check XAI API status
        const xaiStatus = process.env.XAI_API_KEY ? "available" : "unavailable"

        setStatus({
          groq: groqStatus,
          xai: xaiStatus,
          lastChecked: new Date(),
        })
      } catch (error) {
        console.error("Error checking API status:", error)
      }
    }

    checkApiStatus()
    const interval = setInterval(checkApiStatus, 5 * 60 * 1000) // Check every 5 minutes

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">AI API Status</CardTitle>
        <CardDescription>
          Status of connected AI providers
          {status.lastChecked && (
            <span className="text-xs text-muted-foreground ml-2">
              Last checked: {status.lastChecked.toLocaleTimeString()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <Badge variant="outline" className="mr-2 bg-purple-500/10 text-purple-500 border-purple-500/20">
              Groq
            </Badge>
            Groq API
          </span>
          <StatusBadge status={status.groq} />
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <Badge variant="outline" className="mr-2 bg-blue-500/10 text-blue-500 border-blue-500/20">
              XAI
            </Badge>
            Grok API
          </span>
          <StatusBadge status={status.xai} />
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: ApiStatus }) {
  if (status === "available") {
    return (
      <Badge className="bg-green-500/10 text-green-500 border-green-500/20 flex items-center">
        <CheckCircle className="h-3 w-3 mr-1" />
        Available
      </Badge>
    )
  } else if (status === "unavailable") {
    return (
      <Badge variant="destructive" className="flex items-center">
        <XCircle className="h-3 w-3 mr-1" />
        Unavailable
      </Badge>
    )
  } else {
    return (
      <Badge variant="outline" className="flex items-center">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Unknown
      </Badge>
    )
  }
}

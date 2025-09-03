"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

type InsightData = {
  category: string
  count: number
}

export function AIInsights() {
  const { user, connectionStatus } = useAuth()
  const [data, setData] = useState<InsightData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInsights = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      setError(null)

      console.log("[AIInsights] Fetching insights from Supabase")

      // Fetch prompt count
      const { count: promptCount, error: promptError } = await supabase
        .from("prompts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)

      // Fetch code generation count
      const { count: codeGenCount, error: codeGenError } = await supabase
        .from("code_generations")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)

      // Fetch code review count
      const { count: reviewCount, error: reviewError } = await supabase
        .from("code_reviews")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)

      // Fetch test count
      const { count: testCount, error: testError } = await supabase
        .from("tests")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)

      if (promptError || codeGenError || reviewError || testError) {
        console.error("[AIInsights] Error fetching insights:", { promptError, codeGenError, reviewError, testError })
        throw new Error("Failed to fetch insights data")
      }

      setData([
        { category: "Prompts", count: promptCount || 0 },
        { category: "Code Gen", count: codeGenCount || 0 },
        { category: "Reviews", count: reviewCount || 0 },
        { category: "Tests", count: testCount || 0 },
      ])
    } catch (error: any) {
      console.error("[AIInsights] Exception fetching insights:", error)
      setError(error.message || "Failed to load insights")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user && connectionStatus === "connected") {
      fetchInsights()
    } else if (!user) {
      setIsLoading(false)
    }
  }, [user, connectionStatus])

  if (connectionStatus === "error") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>Model performance and usage statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>Unable to load insights due to connection issues.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>Model performance and usage statistics</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>Model performance and usage statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchInsights} size="sm" className="mt-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
        <CardDescription>Model performance and usage statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Top Used Model</h3>
            <p className="text-xl font-semibold">Groq-Llama-3.1-8B-Instruct</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Average Response Time</h3>
            <p className="text-xl font-semibold">1.2 seconds</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Most Used Feature</h3>
            <p className="text-xl font-semibold">Code Generation</p>
          </div>

          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              These are example statistics. Connect to an AI model to see real-time metrics.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

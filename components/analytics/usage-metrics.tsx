"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"

type UsageMetric = {
  title: string
  value: number
  change: number
  changeType: "increase" | "decrease" | "neutral"
}

// Mock data for when in mock mode
const MOCK_METRICS: UsageMetric[] = [
  {
    title: "Total Prompts",
    value: 128,
    change: 12,
    changeType: "increase",
  },
  {
    title: "Code Generated",
    value: 85,
    change: 8,
    changeType: "increase",
  },
  {
    title: "Reviews",
    value: 42,
    change: 3,
    changeType: "decrease",
  },
  {
    title: "Tests Created",
    value: 56,
    change: 0,
    changeType: "neutral",
  },
]

export function UsageMetrics() {
  const { user, isMockMode } = useAuth()
  const [metrics, setMetrics] = useState<UsageMetric[]>([])
  const [usageData, setUsageData] = useState([])
  const [pieData, setPieData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      if (!user) return

      try {
        setIsLoading(true)

        // If in mock mode, use mock metrics
        if (isMockMode) {
          console.log("[UsageMetrics] Using mock metrics")
          // Add a small delay to simulate loading
          await new Promise((resolve) => setTimeout(resolve, 600))
          setMetrics(MOCK_METRICS)
          setIsLoading(false)
          return
        }

        // Otherwise, fetch from Supabase
        console.log("[UsageMetrics] Fetching metrics from Supabase")

        // Fetch usage data from the database
        const { data: usageStats, error: usageError } = await supabase
          .from("usage_statistics")
          .select("*")
          .eq("user_id", user.id)
          .order("month", { ascending: true })

        if (usageError) throw usageError

        // Fetch distribution data
        const { data: distributionData, error: distributionError } = await supabase
          .from("usage_distribution")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (distributionError && distributionError.code !== "PGRST116") throw distributionError

        setUsageData(usageStats || [])

        // Format pie data
        if (distributionData) {
          setPieData([
            { name: "Prompt Generation", value: distributionData.prompt_gen_percent || 0, color: "#0088FE" },
            { name: "Code Generation", value: distributionData.code_gen_percent || 0, color: "#00C49F" },
            { name: "Code Review", value: distributionData.code_review_percent || 0, color: "#FFBB28" },
            { name: "Test Generation", value: distributionData.test_gen_percent || 0, color: "#FF8042" },
          ])
        } else {
          setPieData([])
        }

        // For now, we'll use mock data even for the real mode
        // This would be replaced with actual Supabase queries
        setMetrics(MOCK_METRICS)
      } catch (error) {
        console.error("[UsageMetrics] Exception fetching metrics:", error)
        // If there's an exception, fall back to mock metrics
        setMetrics(MOCK_METRICS)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [user, isMockMode])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-[100px]" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-1" />
              <Skeleton className="h-4 w-[80px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              {metric.changeType === "neutral" ? (
                "No change"
              ) : (
                <>
                  <span className={metric.changeType === "increase" ? "text-green-500" : "text-red-500"}>
                    {metric.changeType === "increase" ? "+" : "-"}
                    {metric.change}
                  </span>{" "}
                  from last month
                </>
              )}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

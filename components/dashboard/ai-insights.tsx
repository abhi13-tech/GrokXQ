"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Lightbulb } from "lucide-react"

type Insight = {
  id: string
  title: string
  description: string
  score: number
  recommendations: string[]
  user_id: string
  created_at: string
}

export function AIInsights() {
  const { user } = useAuth()
  const [insights, setInsights] = useState<Insight[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchInsights() {
      if (!user) return

      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from("ai_insights")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3)

        if (error) throw error
        setInsights(data || [])
      } catch (error) {
        console.error("Error fetching insights:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInsights()
  }, [user])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-5 w-1/2 mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>Personalized recommendations for your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Lightbulb className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground">No insights available yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Use the platform more to receive personalized AI insights
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
      {insights.map((insight) => (
        <Card key={insight.id}>
          <CardHeader>
            <CardTitle>{insight.title}</CardTitle>
            <CardDescription>{insight.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Score</span>
                  <span className="text-sm font-medium">{insight.score}%</span>
                </div>
                <Progress value={insight.score} />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recommendations</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {insight.recommendations.map((rec, i) => (
                    <li key={i} className="list-disc list-inside">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

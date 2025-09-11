"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { AIInsights } from "@/components/dashboard/ai-insights"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { FileText, Code, GitPullRequest, ClipboardList } from "lucide-react"
import { WelcomeGuide } from "@/components/dashboard/welcome-guide"
import { Skeleton } from "@/components/ui/skeleton"

type ActivityStats = {
  promptCount: number
  codeGenCount: number
  codeReviewCount: number
  testCount: number
}

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<ActivityStats>({
    promptCount: 0,
    codeGenCount: 0,
    codeReviewCount: 0,
    testCount: 0,
  })

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return

      try {
        // Fetch activity counts
        const [{ count: promptCount }, { count: codeGenCount }, { count: codeReviewCount }, { count: testCount }] =
          await Promise.all([
            supabase.from("prompts").select("*", { count: "exact", head: true }).eq("user_id", user.id),
            supabase.from("code_generations").select("*", { count: "exact", head: true }).eq("user_id", user.id),
            supabase.from("code_reviews").select("*", { count: "exact", head: true }).eq("user_id", user.id),
            supabase.from("tests").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          ])

        setStats({
          promptCount: promptCount || 0,
          codeGenCount: codeGenCount || 0,
          codeReviewCount: codeReviewCount || 0,
          testCount: testCount || 0,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    } else {
      setIsLoading(false)
    }
  }, [user])

  if (isLoading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Dashboard" text="Welcome to your development dashboard." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-12 mb-1" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
          <div className="col-span-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-start gap-4 rounded-lg border p-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-3">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardShell>
    )
  }

  if (!user) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Dashboard" text="Welcome to your development dashboard." />
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Please sign in to view your dashboard.</p>
        </div>
      </DashboardShell>
    )
  }

  if (stats.promptCount === 0 && stats.codeGenCount === 0 && stats.codeReviewCount === 0 && stats.testCount === 0) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Dashboard" text="Welcome to your development dashboard." />
        <WelcomeGuide userName={profile?.full_name} />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Welcome to your development dashboard." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prompts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.promptCount}</div>
            <p className="text-muted-foreground text-sm">Total Prompts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Code Generations</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.codeGenCount}</div>
            <p className="text-muted-foreground text-sm">Total Code Generations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Code Reviews</CardTitle>
            <GitPullRequest className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.codeReviewCount}</div>
            <p className="text-muted-foreground text-sm">Total Code Reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.testCount}</div>
            <p className="text-muted-foreground text-sm">Total Tests</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RecentActivity />
        </div>
        <div className="col-span-3">
          <AIInsights />
        </div>
      </div>
    </DashboardShell>
  )
}

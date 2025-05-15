"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { ProjectList } from "@/components/dashboard/project-list"
import { AIInsights } from "@/components/dashboard/ai-insights"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { WelcomeGuide } from "@/components/dashboard/welcome-guide"

type ActivityStats = {
  promptCount: number
  codeGenCount: number
  codeReviewCount: number
  testCount: number
  deploymentCount: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<ActivityStats>({
    promptCount: 0,
    codeGenCount: 0,
    codeReviewCount: 0,
    testCount: 0,
    deploymentCount: 0,
  })
  const [recentActivities, setRecentActivities] = useState<any[]>([])

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return

      try {
        // Fetch activity counts
        const [
          { count: promptCount },
          { count: codeGenCount },
          { count: codeReviewCount },
          { count: testCount },
          { count: deploymentCount },
        ] = await Promise.all([
          supabase.from("prompts").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("code_generations").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("code_reviews").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("tests").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("deployments").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        ])

        setStats({
          promptCount: promptCount || 0,
          codeGenCount: codeGenCount || 0,
          codeReviewCount: codeReviewCount || 0,
          testCount: testCount || 0,
          deploymentCount: deploymentCount || 0,
        })

        // Fetch recent activities
        const { data: activities } = await supabase
          .from("activity_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)

        setRecentActivities(activities || [])
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
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
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

  if (
    stats.promptCount === 0 &&
    stats.codeGenCount === 0 &&
    stats.codeReviewCount === 0 &&
    stats.testCount === 0 &&
    stats.deploymentCount === 0
  ) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Dashboard" text="Welcome to your development dashboard." />
        <WelcomeGuide />
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="3.5"></circle>
              <line x1="18" y1="8" x2="23" y2="8"></line>
              <line x1="18" y1="16" x2="23" y2="16"></line>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.promptCount}</div>
            <p className="text-muted-foreground text-sm">Total Prompts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Code Generations</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
              <path d="M6 16v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-1"></path>
              <path d="M18 16v1a1 1 0 0 1-1 1H16a1 1 0 0 1-1-1v-1"></path>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.codeGenCount}</div>
            <p className="text-muted-foreground text-sm">Total Code Generations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Code Reviews</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a.5.5 0 0 0 0 1h5a.5.5 0 0 1 0 1H9a.5.5 0 0 0 0 1h5.5a.5.5 0 0 1 0 1H9a.5.5 0 0 0 0 1h6.5a.5.5 0 0 1 0 1H9a.5.5 0 0 0 0 1h7.5"></path>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.codeReviewCount}</div>
            <p className="text-muted-foreground text-sm">Total Code Reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.testCount}</div>
            <p className="text-muted-foreground text-sm">Total Tests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deployments</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <line x1="12" y1="2" x2="12" y2="22"></line>
              <path d="M17 5H9.5a.5.5 0 0 0 0 1h5a.5.5 0 0 1 0 1H9a.5.5 0 0 0 0 1h5.5a.5.5 0 0 1 0 1H9a.5.5 0 0 0 0 1h6.5a.5.5 0 0 1 0 1H9a.5.5 0 0 0 0 1h7.5"></path>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deploymentCount}</div>
            <p className="text-muted-foreground text-sm">Total Deployments</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RecentActivity activities={recentActivities} />
        </div>
        <div className="col-span-3">
          <AIInsights />
        </div>
      </div>
      <ProjectList />
    </DashboardShell>
  )
}

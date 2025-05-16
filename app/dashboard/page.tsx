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
import { DashboardLoading } from "@/components/dashboard/dashboard-loading"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type ActivityStats = {
  promptCount: number
  codeGenCount: number
  codeReviewCount: number
  testCount: number
}

export default function DashboardPage() {
  const { user, profile, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
        console.log("[Dashboard] Fetching dashboard data for user:", user.email)
        setError(null)

        // Fetch activity counts
        const [
          { count: promptCount, error: promptError },
          { count: codeGenCount, error: codeGenError },
          { count: codeReviewCount, error: codeReviewError },
          { count: testCount, error: testError },
        ] = await Promise.all([
          supabase.from("prompts").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("code_generations").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("code_reviews").select("*", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("tests").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        ])

        // Check for errors
        if (promptError || codeGenError || codeReviewError || testError) {
          console.error("[Dashboard] Error fetching counts:", { promptError, codeGenError, codeReviewError, testError })
          throw new Error("Failed to fetch dashboard data")
        }

        console.log("[Dashboard] Data fetched successfully:", { promptCount, codeGenCount, codeReviewCount, testCount })

        setStats({
          promptCount: promptCount || 0,
          codeGenCount: codeGenCount || 0,
          codeReviewCount: codeReviewCount || 0,
          testCount: testCount || 0,
        })
      } catch (error: any) {
        console.error("[Dashboard] Error fetching dashboard data:", error)
        setError(error.message || "Failed to load dashboard data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    // Only fetch data if user is authenticated and auth loading is complete
    if (user && !authLoading) {
      console.log("[Dashboard] User authenticated, fetching data")
      fetchDashboardData()
    } else if (!authLoading) {
      console.log("[Dashboard] No authenticated user, skipping data fetch")
      setIsLoading(false)
    }
  }, [user, authLoading])

  // Show loading state while auth is loading or data is being fetched
  if (authLoading || isLoading) {
    return (
      <DashboardShell>
        <DashboardLoading />
      </DashboardShell>
    )
  }

  // Show error state
  if (error) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Dashboard" text="Welcome to your development dashboard." />
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </DashboardShell>
    )
  }

  // Show not authenticated state
  if (!user) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Dashboard" text="Welcome to your development dashboard." />
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Please sign in to view your dashboard.</p>
          <Button asChild>
            <a href="/sign-in">Sign In</a>
          </Button>
        </div>
      </DashboardShell>
    )
  }

  // Show welcome guide for new users
  if (stats.promptCount === 0 && stats.codeGenCount === 0 && stats.codeReviewCount === 0 && stats.testCount === 0) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Dashboard" text="Welcome to your development dashboard." />
        <WelcomeGuide userName={profile?.full_name} />
      </DashboardShell>
    )
  }

  // Show dashboard with data
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

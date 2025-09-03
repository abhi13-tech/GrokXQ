"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Code, FileText, GitPullRequest, ClipboardList } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useDefault } from "@/contexts/default-context"

type Activity = {
  id: string
  activity_type: string
  description: string
  created_at: string
}

// Sample activities data for the stateless app
const sampleActivities: Activity[] = [
  {
    id: "1",
    activity_type: "code_generation",
    description: "Generated React authentication component",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    activity_type: "code_review",
    description: "Reviewed API implementation code",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    activity_type: "test_generation",
    description: "Generated unit tests for user service",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    activity_type: "prompt_generation",
    description: "Created prompt for database schema design",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export function RecentActivity() {
  const { user } = useDefault()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchActivities() {
      try {
        setIsLoading(true)

        // In a stateless app, we'll use sample data instead of fetching from an API
        setActivities(sampleActivities)

        // Simulate API loading time
        setTimeout(() => {
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error("Error fetching activities:", error)
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [user])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "prompt_generation":
        return <FileText className="h-4 w-4" />
      case "code_generation":
        return <Code className="h-4 w-4" />
      case "code_review":
        return <GitPullRequest className="h-4 w-4" />
      case "test_generation":
        return <ClipboardList className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions and updates</CardDescription>
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
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">No recent activity to display</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

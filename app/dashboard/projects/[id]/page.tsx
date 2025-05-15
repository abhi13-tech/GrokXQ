"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Edit, Trash, Code, MessageSquare, GitPullRequest, Play, Rocket } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

type Project = {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

type ActivityItem = {
  id: string
  activity_type: string
  description: string
  created_at: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user && projectId) {
      fetchProjectDetails()
    }
  }, [user, projectId])

  const fetchProjectDetails = async () => {
    if (!user || !projectId) return

    setIsLoading(true)
    try {
      // Fetch project details
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .eq("user_id", user.id)
        .single()

      if (projectError) {
        throw projectError
      }

      setProject(projectData)

      // Fetch project activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from("activity_logs")
        .select("id, activity_type, description, created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(10)

      if (activitiesError) {
        throw activitiesError
      }

      setActivities(activitiesData || [])
    } catch (error) {
      console.error("Error fetching project details:", error)
      toast({
        title: "Error fetching project",
        description: "Failed to load project details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "prompt_generation":
        return <MessageSquare className="h-4 w-4" />
      case "code_generation":
        return <Code className="h-4 w-4" />
      case "code_review":
        return <GitPullRequest className="h-4 w-4" />
      case "test_generation":
        return <Play className="h-4 w-4" />
      case "deployment":
        return <Rocket className="h-4 w-4" />
      default:
        return <Code className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardShell>
    )
  }

  if (!project) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Project Not Found" text="The requested project could not be found." />
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                The project you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={project.name} text={project.description || "No description provided"}>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-destructive">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>Summary of your project activities and resources</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="activities">
              <TabsList className="mb-4">
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="activities">
                {activities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No activities recorded for this project yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-3 border rounded-lg">
                        <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.activity_type)}</div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm">{activity.description}</p>
                          <div className="flex items-center pt-1">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="resources">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Prompts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">AI prompts generated for this project</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Code</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Generated code and components</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Tests</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Test cases and test suites</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Deployments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Deployment history and environments</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="settings">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <h3 className="text-sm font-medium">Project Details</h3>
                    <p className="text-sm text-muted-foreground">
                      Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Last updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <h3 className="text-sm font-medium">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete this project and all its resources
                    </p>
                    <Button variant="destructive" size="sm">
                      Delete Project
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Tools for this project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Button variant="outline" className="justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Generate Prompt
              </Button>
              <Button variant="outline" className="justify-start">
                <Code className="mr-2 h-4 w-4" />
                Generate Code
              </Button>
              <Button variant="outline" className="justify-start">
                <GitPullRequest className="mr-2 h-4 w-4" />
                Review Code
              </Button>
              <Button variant="outline" className="justify-start">
                <Play className="mr-2 h-4 w-4" />
                Generate Tests
              </Button>
              <Button variant="outline" className="justify-start">
                <Rocket className="mr-2 h-4 w-4" />
                Deploy Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

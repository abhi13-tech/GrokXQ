"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Check, Clock, Code, FileCode, GitBranch, GitPullRequest, Play } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type WorkflowStep = {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed" | "failed"
  icon: React.ReactNode
}

export function DevelopmentWorkflow() {
  const [activeProject, setActiveProject] = useState("e-commerce")
  const { toast } = useToast()

  const projects = [
    { id: "e-commerce", name: "E-commerce App", progress: 75 },
    { id: "dashboard", name: "Analytics Dashboard", progress: 40 },
    { id: "mobile-app", name: "Mobile App", progress: 90 },
  ]

  const workflowSteps: Record<string, WorkflowStep[]> = {
    "e-commerce": [
      {
        id: "code-generation",
        title: "Code Generation",
        description: "Generate API endpoints for user authentication",
        status: "completed",
        icon: <Code className="h-5 w-5" />,
      },
      {
        id: "code-review",
        title: "Code Review",
        description: "Review pull request #42: Add cart functionality",
        status: "completed",
        icon: <GitPullRequest className="h-5 w-5" />,
      },
      {
        id: "testing",
        title: "Testing",
        description: "Generate and run tests for cart functionality",
        status: "in-progress",
        icon: <Play className="h-5 w-5" />,
      },
    ],
    dashboard: [
      {
        id: "code-generation",
        title: "Code Generation",
        description: "Generate data visualization components",
        status: "completed",
        icon: <Code className="h-5 w-5" />,
      },
      {
        id: "code-review",
        title: "Code Review",
        description: "Review pull request #15: Add dashboard filters",
        status: "in-progress",
        icon: <GitPullRequest className="h-5 w-5" />,
      },
      {
        id: "testing",
        title: "Testing",
        description: "Generate tests for dashboard components",
        status: "pending",
        icon: <Play className="h-5 w-5" />,
      },
    ],
    "mobile-app": [
      {
        id: "code-generation",
        title: "Code Generation",
        description: "Generate React Native components for profile screen",
        status: "completed",
        icon: <Code className="h-5 w-5" />,
      },
      {
        id: "code-review",
        title: "Code Review",
        description: "Review pull request #28: Add push notifications",
        status: "completed",
        icon: <GitPullRequest className="h-5 w-5" />,
      },
      {
        id: "testing",
        title: "Testing",
        description: "Generate and run tests for notification system",
        status: "completed",
        icon: <Play className="h-5 w-5" />,
      },
    ],
  }

  const getStatusBadge = (status: WorkflowStep["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const getStatusIcon = (status: WorkflowStep["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "failed":
        return <div className="h-5 w-5 text-red-500">✕</div>
      default:
        return <div className="h-5 w-5 text-gray-300">○</div>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Development Workflow</CardTitle>
          <CardDescription>
            Manage and track your development process from code generation to deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeProject} onValueChange={setActiveProject}>
            <TabsList className="grid grid-cols-3 mb-6">
              {projects.map((project) => (
                <TabsTrigger key={project.id} value={project.id}>
                  {project.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {projects.map((project) => (
              <TabsContent key={project.id} value={project.id}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Project Progress</h3>
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} />
                  </div>

                  <div className="space-y-4">
                    {workflowSteps[project.id].map((step) => (
                      <div key={step.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0 mt-1">{getStatusIcon(step.status)}</div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{step.title}</h4>
                            {getStatusBadge(step.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileCode className="mr-2 h-4 w-4" />
              Generate Code
            </Button>
            <Button variant="outline" size="sm">
              <GitBranch className="mr-2 h-4 w-4" />
              Create Branch
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Play className="mr-2 h-4 w-4" />
            Run Tests
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Development Insights</CardTitle>
          <CardDescription>AI-powered insights to improve your development process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Code Quality Analysis</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Based on your recent commits, we've identified the following areas for improvement:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Increase test coverage for authentication components</li>
                <li>Refactor cart service to improve performance</li>
                <li>Add proper error handling to API calls</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Development Velocity</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Your team's development velocity has increased by 15% in the last sprint.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-xs text-muted-foreground">Tasks Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-xs text-muted-foreground">Pull Requests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-xs text-muted-foreground">Deployments</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { PlusCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from "date-fns"

type Project = {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchProjects()
    }
  }, [user])

  const fetchProjects = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (error) {
        throw error
      }

      setProjects(data || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast({
        title: "Error fetching projects",
        description: "Failed to load your projects. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createProject = async () => {
    if (!user) return
    if (!newProjectName.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          name: newProjectName.trim(),
          description: newProjectDescription.trim() || null,
          user_id: user.id,
        })
        .select()

      if (error) {
        throw error
      }

      setProjects([...(data || []), ...projects])
      setNewProjectName("")
      setNewProjectDescription("")
      setDialogOpen(false)

      toast({
        title: "Project created",
        description: "Your new project has been created successfully.",
      })
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error creating project",
        description: "Failed to create your project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Projects" text="Manage your development projects.">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Add a new project to organize your development work.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="My Awesome Project"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="A brief description of your project"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createProject} disabled={isCreating || !newProjectName.trim()}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 w-3/4 bg-muted rounded"></div>
                <div className="h-4 w-full bg-muted rounded mt-2"></div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-4 w-1/2 bg-muted rounded"></div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="h-4 w-1/3 bg-muted rounded"></div>
                <div className="h-8 w-16 bg-muted rounded"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Create Your First Project</CardTitle>
            <CardDescription>Projects help you organize your development work</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-primary/10 p-6 mb-4">
                <PlusCircle className="h-12 w-12 text-primary" />
              </div>
              <p className="text-muted-foreground max-w-md">
                Projects help you organize your development work, track progress, and manage resources. Create your
                first project to get started.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => setDialogOpen(true)} size="lg">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Project
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle>{project.name}</CardTitle>
                  <Badge variant="outline">Active</Badge>
                </div>
                <CardDescription>{project.description || "No description provided"}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">
                    Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-xs text-muted-foreground">
                  Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                </span>
                <Link href={`/dashboard/projects/${project.id}`}>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}

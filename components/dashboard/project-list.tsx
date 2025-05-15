import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"

export function ProjectList() {
  const projects = [
    {
      id: 1,
      name: "E-commerce App",
      description: "Online shopping platform with cart and checkout functionality",
      status: "In Progress",
      lastUpdated: "2 hours ago",
      language: "TypeScript",
      framework: "Next.js",
    },
    {
      id: 2,
      name: "Task Manager",
      description: "Productivity app for managing tasks and projects",
      status: "Active",
      lastUpdated: "1 day ago",
      language: "JavaScript",
      framework: "React",
    },
    {
      id: 3,
      name: "Portfolio Site",
      description: "Personal portfolio website showcasing projects and skills",
      status: "Deployed",
      lastUpdated: "3 days ago",
      language: "TypeScript",
      framework: "Astro",
    },
    {
      id: 4,
      name: "Analytics Dashboard",
      description: "Data visualization dashboard for business metrics",
      status: "Planning",
      lastUpdated: "1 week ago",
      language: "Python",
      framework: "Flask",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Projects</h2>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle>{project.name}</CardTitle>
                <Badge
                  variant={
                    project.status === "Deployed"
                      ? "default"
                      : project.status === "In Progress"
                        ? "secondary"
                        : project.status === "Active"
                          ? "success"
                          : "outline"
                  }
                >
                  {project.status}
                </Badge>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline">{project.language}</Badge>
                <Badge variant="outline">{project.framework}</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <span className="text-xs text-muted-foreground">Updated {project.lastUpdated}</span>
              <Link href={`/dashboard/projects/${project.id}`}>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

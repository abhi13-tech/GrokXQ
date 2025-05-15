"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, CheckCircle2, Clock, CloudOff, Loader2, RefreshCw, Rocket, Server } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Environment = "development" | "staging" | "production"
type DeploymentStatus = "idle" | "deploying" | "success" | "failed"

type Project = {
  id: string
  name: string
  description: string
  environments: Record<
    Environment,
    {
      status: DeploymentStatus
      lastDeployed: string | null
      version: string | null
      url: string | null
    }
  >
}

const formSchema = z.object({
  environment: z.string(),
  version: z.string().optional(),
})

export function DeploymentManager() {
  const [activeProject, setActiveProject] = useState("e-commerce")
  const [deploymentStatus, setDeploymentStatus] = useState<Record<string, DeploymentStatus>>({
    "e-commerce": "idle",
    dashboard: "idle",
    "mobile-app": "idle",
  })
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      environment: "development",
      version: "latest",
    },
  })

  const projects: Project[] = [
    {
      id: "e-commerce",
      name: "E-commerce App",
      description: "Online shopping platform with cart and checkout functionality",
      environments: {
        development: {
          status: "success",
          lastDeployed: "2023-05-10T14:30:00Z",
          version: "v0.8.2",
          url: "https://dev.ecommerce.example.com",
        },
        staging: {
          status: "success",
          lastDeployed: "2023-05-08T10:15:00Z",
          version: "v0.8.0",
          url: "https://staging.ecommerce.example.com",
        },
        production: {
          status: "idle",
          lastDeployed: "2023-05-01T09:00:00Z",
          version: "v0.7.5",
          url: "https://ecommerce.example.com",
        },
      },
    },
    {
      id: "dashboard",
      name: "Analytics Dashboard",
      description: "Data visualization dashboard for business metrics",
      environments: {
        development: {
          status: "success",
          lastDeployed: "2023-05-12T11:45:00Z",
          version: "v1.2.0",
          url: "https://dev.dashboard.example.com",
        },
        staging: {
          status: "failed",
          lastDeployed: "2023-05-11T16:20:00Z",
          version: "v1.1.8",
          url: null,
        },
        production: {
          status: "success",
          lastDeployed: "2023-05-05T08:30:00Z",
          version: "v1.1.5",
          url: "https://dashboard.example.com",
        },
      },
    },
    {
      id: "mobile-app",
      name: "Mobile App",
      description: "Cross-platform mobile application",
      environments: {
        development: {
          status: "success",
          lastDeployed: "2023-05-14T09:10:00Z",
          version: "v2.3.1",
          url: "https://dev.mobile.example.com",
        },
        staging: {
          status: "success",
          lastDeployed: "2023-05-13T14:00:00Z",
          version: "v2.3.0",
          url: "https://staging.mobile.example.com",
        },
        production: {
          status: "success",
          lastDeployed: "2023-05-10T10:00:00Z",
          version: "v2.2.5",
          url: "https://mobile.example.com",
        },
      },
    },
  ]

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setDeploymentStatus({
      ...deploymentStatus,
      [activeProject]: "deploying",
    })

    // Simulate deployment process
    toast({
      title: "Deployment started",
      description: `Deploying ${projects.find((p) => p.id === activeProject)?.name} to ${data.environment}...`,
    })

    setTimeout(() => {
      const success = Math.random() > 0.2 // 80% success rate
      setDeploymentStatus({
        ...deploymentStatus,
        [activeProject]: success ? "success" : "failed",
      })

      toast({
        title: success ? "Deployment successful" : "Deployment failed",
        description: success
          ? `Successfully deployed to ${data.environment}`
          : `Failed to deploy to ${data.environment}. Check logs for details.`,
        variant: success ? "default" : "destructive",
      })
    }, 3000)
  }

  const getStatusBadge = (status: DeploymentStatus) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Deployed</Badge>
      case "deploying":
        return <Badge className="bg-blue-500">Deploying</Badge>
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>
      default:
        return <Badge variant="outline">Not Deployed</Badge>
    }
  }

  const getStatusIcon = (status: DeploymentStatus) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "deploying":
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <CloudOff className="h-5 w-5 text-gray-300" />
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Deployment Manager</CardTitle>
          <CardDescription>Deploy and manage your applications across different environments</CardDescription>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(["development", "staging", "production"] as Environment[]).map((env) => {
                      const envData = project.environments[env]
                      return (
                        <Card key={env} className="overflow-hidden">
                          <CardHeader className="p-4">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base capitalize">{env}</CardTitle>
                              {getStatusBadge(
                                deploymentStatus[project.id] === "deploying" && form.watch("environment") === env
                                  ? "deploying"
                                  : envData.status,
                              )}
                            </div>
                            <CardDescription>{project.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(
                                    deploymentStatus[project.id] === "deploying" && form.watch("environment") === env
                                      ? "deploying"
                                      : envData.status,
                                  )}
                                  <span>
                                    {deploymentStatus[project.id] === "deploying" && form.watch("environment") === env
                                      ? "Deploying..."
                                      : envData.status === "success"
                                        ? "Deployed"
                                        : envData.status === "failed"
                                          ? "Failed"
                                          : "Not Deployed"}
                                  </span>
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Version:</span>
                                <span>{envData.version || "N/A"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Last Deployed:</span>
                                <span>{formatDate(envData.lastDeployed)}</span>
                              </div>
                              {envData.url && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">URL:</span>
                                  <a
                                    href={envData.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    {envData.url}
                                  </a>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="environment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Environment</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select environment" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="development">Development</SelectItem>
                                  <SelectItem value="staging">Staging</SelectItem>
                                  <SelectItem value="production">Production</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>Select the environment to deploy to</FormDescription>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="version"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Version</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select version" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="latest">Latest (from main branch)</SelectItem>
                                  <SelectItem value="v1.0.0">v1.0.0</SelectItem>
                                  <SelectItem value="v0.9.5">v0.9.5</SelectItem>
                                  <SelectItem value="v0.9.0">v0.9.0</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>Select the version to deploy</FormDescription>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={deploymentStatus[activeProject] === "deploying"}
                          className="flex items-center gap-2"
                        >
                          {deploymentStatus[activeProject] === "deploying" ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Deploying...
                            </>
                          ) : (
                            <>
                              <Rocket className="h-4 w-4" />
                              Deploy
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deployment History</CardTitle>
          <CardDescription>Recent deployment activities across all environments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                project: "E-commerce App",
                environment: "Development",
                version: "v0.8.2",
                status: "success",
                timestamp: "2023-05-10T14:30:00Z",
                user: "Alex Johnson",
              },
              {
                project: "Analytics Dashboard",
                environment: "Staging",
                version: "v1.1.8",
                status: "failed",
                timestamp: "2023-05-11T16:20:00Z",
                user: "Sarah Miller",
              },
              {
                project: "Mobile App",
                environment: "Development",
                version: "v2.3.1",
                status: "success",
                timestamp: "2023-05-14T09:10:00Z",
                user: "David Chen",
              },
              {
                project: "E-commerce App",
                environment: "Staging",
                version: "v0.8.0",
                status: "success",
                timestamp: "2023-05-08T10:15:00Z",
                user: "Alex Johnson",
              },
              {
                project: "Mobile App",
                environment: "Production",
                version: "v2.2.5",
                status: "success",
                timestamp: "2023-05-10T10:00:00Z",
                user: "Emily Rodriguez",
              },
            ].map((deployment, index) => (
              <div key={index} className="flex items-start gap-4 p-3 border rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {deployment.status === "success" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      {deployment.project} to {deployment.environment}
                    </h4>
                    <Badge className={deployment.status === "success" ? "bg-green-500" : "bg-red-500"}>
                      {deployment.status === "success" ? "Success" : "Failed"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Version {deployment.version} deployed by {deployment.user}
                  </p>
                  <div className="flex items-center pt-1">
                    <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{formatDate(deployment.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            <Server className="mr-2 h-4 w-4" />
            View All Deployments
          </Button>
          <Button variant="outline" size="sm">
            Export Logs
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

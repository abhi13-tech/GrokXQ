"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { UserPlus, MessageSquare, GitBranch, FileCheck, User, Users } from "lucide-react"

// Sample team members data
const teamMembers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Admin",
    avatar: "/abstract-user-avatar-1.png",
    online: true,
  },
  {
    id: 2,
    name: "Sarah Miller",
    email: "sarah@example.com",
    role: "Developer",
    avatar: "/abstract-user-avatar-2.png",
    online: true,
  },
  {
    id: 3,
    name: "Demo User",
    email: "demo@example.com",
    role: "Owner",
    avatar: "/abstract-user-avatar.png",
    online: true,
  },
  {
    id: 4,
    name: "Michael Thompson",
    email: "michael@example.com",
    role: "Developer",
    avatar: "/abstract-geometric-shapes.png",
    online: false,
  },
]

// Sample shared projects data
const sharedProjects = [
  {
    id: 1,
    name: "E-commerce App",
    description: "Team collaboration on shopping platform",
    lastUpdated: "2 hours ago",
    members: [1, 2, 3],
  },
  {
    id: 2,
    name: "Analytics Dashboard",
    description: "Visualization dashboard for metrics",
    lastUpdated: "1 day ago",
    members: [2, 3, 4],
  },
]

// Sample activity data
const recentActivity = [
  {
    id: 1,
    user: teamMembers[0],
    action: "Generated code for cart functionality",
    project: "E-commerce App",
    time: "1 hour ago",
    icon: <Code className="h-4 w-4" />,
  },
  {
    id: 2,
    user: teamMembers[1],
    action: "Reviewed pull request #42",
    project: "E-commerce App",
    time: "3 hours ago",
    icon: <GitBranch className="h-4 w-4" />,
  },
  {
    id: 3,
    user: teamMembers[2],
    action: "Generated test cases for data visualization",
    project: "Analytics Dashboard",
    time: "Yesterday",
    icon: <FileCheck className="h-4 w-4" />,
  },
]

// Import needed for the activity feed icons
import { Code } from "lucide-react"

export function TeamWorkspace() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")

  const handleInvite = () => {
    if (!inviteEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Invitation sent",
        description: `Invitation has been sent to ${inviteEmail}`,
      })
      setInviteEmail("")
    }, 1000)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-2 border-primary/20 overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Team Workspace</CardTitle>
              <CardDescription>Collaborate with your team members</CardDescription>
            </div>
            <Button variant="default" size="sm" className="gap-1.5">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="members">
            <TabsList className="mb-4">
              <TabsTrigger value="members">
                <User className="h-4 w-4 mr-2" />
                Members
              </TabsTrigger>
              <TabsTrigger value="projects">
                <Users className="h-4 w-4 mr-2" />
                Shared Projects
              </TabsTrigger>
              <TabsTrigger value="activity">
                <MessageSquare className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="space-y-4">
              <div className="grid gap-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        {member.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <Badge
                      variant={member.role === "Owner" ? "default" : member.role === "Admin" ? "secondary" : "outline"}
                    >
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Invite a team member</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="border-primary/20 bg-background/50 focus:border-primary"
                  />
                  <Button onClick={handleInvite} disabled={loading}>
                    {loading ? "Sending..." : "Invite"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {sharedProjects.map((project) => (
                  <Card key={project.id} className="border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex -space-x-2">
                        {project.members.map((memberId) => {
                          const member = teamMembers.find((m) => m.id === memberId)
                          if (!member) return null
                          return (
                            <Avatar key={memberId} className="border-2 border-background h-8 w-8">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                          )
                        })}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="text-xs text-muted-foreground">Updated {project.lastUpdated}</div>
                    </CardFooter>
                  </Card>
                ))}
                <Card className="border-dashed border-2 border-primary/20 flex items-center justify-center h-[172px]">
                  <Button variant="ghost" className="flex flex-col h-full w-full gap-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      <span className="text-2xl">+</span>
                    </div>
                    <span>Create new shared project</span>
                  </Button>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <div className="grid gap-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                      <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{activity.user.name}</span>
                        <span className="text-muted-foreground text-xs">• {activity.time}</span>
                      </div>
                      <p className="text-sm flex items-center gap-1.5">
                        {activity.icon}
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">in {activity.project}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}

"use client"

import { CardFooter } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCode, GitBranch, MessageSquare, Play } from "lucide-react"
import Link from "next/link"

interface WelcomeGuideProps {
  userName?: string
}

export function WelcomeGuide({ userName = "there" }: WelcomeGuideProps) {
  const features = [
    {
      title: "Generate Prompts",
      description: "Create powerful AI prompts for your projects",
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      href: "/",
    },
    {
      title: "Generate Code",
      description: "Create code snippets, functions, and components",
      icon: <FileCode className="h-8 w-8 text-primary" />,
      href: "/code-generation",
    },
    {
      title: "Review Code",
      description: "Get AI-powered feedback on your code",
      icon: <GitBranch className="h-8 w-8 text-primary" />,
      href: "/code-review",
    },
    {
      title: "Generate Tests",
      description: "Create comprehensive tests for your code",
      icon: <Play className="h-8 w-8 text-primary" />,
      href: "/testing",
    },
  ]

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome, {userName}!</CardTitle>
        <CardDescription>Get started with these powerful AI-powered development tools</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="p-4">
                <div className="flex items-center gap-2">
                  {feature.icon}
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link href={feature.href} className="w-full">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Code, GitPullRequest, ClipboardList, ArrowRight } from "lucide-react"
import Link from "next/link"

interface WelcomeGuideProps {
  userName?: string | null
}

export function WelcomeGuide({ userName }: WelcomeGuideProps) {
  return (
    <div className="space-y-8">
      <Card className="border-2 border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome{userName ? `, ${userName}` : ""}!</CardTitle>
          <CardDescription className="text-base">
            Get started with your AI development suite by exploring these features:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FeatureCard
              icon={<FileText className="h-8 w-8 text-blue-500" />}
              title="Prompt Generation"
              description="Create customized AI prompts for various use cases"
              href="/code-generation"
            />
            <FeatureCard
              icon={<Code className="h-8 w-8 text-purple-500" />}
              title="Code Generation"
              description="Generate code snippets and complete functions"
              href="/code-generation"
            />
            <FeatureCard
              icon={<GitPullRequest className="h-8 w-8 text-green-500" />}
              title="Code Review"
              description="Get AI-powered reviews of your code"
              href="/code-review"
            />
            <FeatureCard
              icon={<ClipboardList className="h-8 w-8 text-amber-500" />}
              title="Test Generation"
              description="Create test cases for your code"
              href="/testing"
            />
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Start using these features to see your activity appear on the dashboard.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}

function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        {icon}
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild variant="ghost" size="sm" className="w-full justify-between">
          <Link href={href}>
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

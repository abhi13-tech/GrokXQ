import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code, FileCode, GitPullRequest, Zap } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      icon: <Code className="h-4 w-4 mr-2" />,
      label: "Generate Code",
      href: "/code-generation",
      description: "Create new components or functions",
    },
    {
      icon: <Zap className="h-4 w-4 mr-2" />,
      label: "Debug Code",
      href: "/tools/debugging",
      description: "Find and fix issues in your code",
    },
    {
      icon: <FileCode className="h-4 w-4 mr-2" />,
      label: "Create Tests",
      href: "/testing",
      description: "Generate test cases for your code",
    },
    {
      icon: <GitPullRequest className="h-4 w-4 mr-2" />,
      label: "Review Code",
      href: "/code-review",
      description: "Get feedback on your code",
    },
  ]

  return (
    <div className="grid gap-2">
      {actions.map((action, index) => (
        <Link key={index} href={action.href}>
          <Button variant="outline" className="w-full justify-start h-auto py-2">
            <div className="flex items-center">
              {action.icon}
              <div className="flex flex-col items-start">
                <span>{action.label}</span>
                <span className="text-xs text-muted-foreground">{action.description}</span>
              </div>
            </div>
          </Button>
        </Link>
      ))}
    </div>
  )
}

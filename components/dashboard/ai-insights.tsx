import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function AIInsights() {
  const insights = [
    {
      title: "Code Quality",
      description: "Based on your recent projects",
      score: 85,
      recommendations: [
        "Consider adding more unit tests to the Task Manager project",
        "Improve error handling in the API endpoints",
      ],
    },
    {
      title: "Development Efficiency",
      description: "Compared to your historical data",
      score: 92,
      recommendations: [
        "You're 15% faster at implementing features than last month",
        "Your debugging time has decreased by 20%",
      ],
    },
    {
      title: "Technology Recommendations",
      description: "Based on your project requirements",
      score: 78,
      recommendations: [
        "Consider using React Query for data fetching in your E-commerce app",
        "TypeScript would improve type safety in your Analytics Dashboard",
      ],
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {insights.map((insight, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{insight.title}</CardTitle>
            <CardDescription>{insight.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Score</span>
                  <span className="text-sm font-medium">{insight.score}%</span>
                </div>
                <Progress value={insight.score} />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recommendations</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {insight.recommendations.map((rec, i) => (
                    <li key={i} className="list-disc list-inside">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

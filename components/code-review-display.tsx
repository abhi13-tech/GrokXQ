"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"

interface CodeReviewDisplayProps {
  review: string
}

export function CodeReviewDisplay({ review }: CodeReviewDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Code Review Results</CardTitle>
        <CardDescription>AI-generated feedback on your code</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{review}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

type PromptHistoryItem = {
  id: string
  topic: string
  prompt_type: string
  tone: string
  generated_prompt: string
  created_at: string
}

interface PromptHistoryProps {
  onSelectPrompt: (prompt: string) => void
}

export function PromptHistory({ onSelectPrompt }: PromptHistoryProps) {
  const { user } = useAuth()
  const [prompts, setPrompts] = useState<PromptHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPromptHistory() {
      if (!user) return

      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from("prompts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10)

        if (error) throw error
        setPrompts(data || [])
      } catch (error) {
        console.error("Error fetching prompt history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPromptHistory()
  }, [user])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prompt History</CardTitle>
          <CardDescription>Your previously generated prompts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border rounded-md p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (prompts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prompt History</CardTitle>
          <CardDescription>Your previously generated prompts will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground">No prompts generated yet</p>
            <p className="text-sm text-muted-foreground mt-1">Generate your first prompt to see it here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prompt History</CardTitle>
        <CardDescription>Your last 10 generated prompts</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {prompts.map((prompt) => (
              <div key={prompt.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{prompt.topic}</h3>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="capitalize">
                      {prompt.prompt_type}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {prompt.tone}
                    </Badge>
                  </div>
                </div>
                <div className="line-clamp-3 mb-2 text-sm">{prompt.generated_prompt}</div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(prompt.created_at), { addSuffix: true })}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => onSelectPrompt(prompt.generated_prompt)}>
                    Use This Prompt
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

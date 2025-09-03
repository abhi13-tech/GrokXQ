"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase-client"

type Prompt = {
  id: string
  content: string
  created_at: string
  model: string
}

// Mock data for when in mock mode
const MOCK_PROMPTS: Prompt[] = [
  {
    id: "mock-prompt-1",
    content: "Create a React component for a user dashboard with analytics",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    model: "groq-llama-3.1-8b-instant",
  },
  {
    id: "mock-prompt-2",
    content: "Generate a database schema for a social media application",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    model: "groq-llama-3.1-8b-instant",
  },
  {
    id: "mock-prompt-3",
    content: "Write a function to calculate the average rating from user reviews",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    model: "groq-llama-3.1-70b",
  },
  {
    id: "mock-prompt-4",
    content: "Create an API endpoint for user authentication",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    model: "groq-llama-3.1-70b",
  },
]

export function PromptHistory() {
  const { user, isMockMode } = useAuth()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPrompts() {
      if (!user) return

      try {
        setIsLoading(true)

        // If in mock mode, use mock prompts
        if (isMockMode) {
          console.log("[PromptHistory] Using mock prompts")
          // Add a small delay to simulate loading
          await new Promise((resolve) => setTimeout(resolve, 800))
          setPrompts(MOCK_PROMPTS)
          setIsLoading(false)
          return
        }

        // Otherwise, fetch from Supabase
        console.log("[PromptHistory] Fetching prompts from Supabase")
        const { data, error } = await supabase
          .from("prompts")
          .select("id, content, created_at, model")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)

        if (error) {
          console.error("[PromptHistory] Error fetching prompts:", error)
          // If there's an error, fall back to mock prompts
          setPrompts(MOCK_PROMPTS)
        } else {
          setPrompts(data || [])
        }
      } catch (error) {
        console.error("[PromptHistory] Exception fetching prompts:", error)
        // If there's an exception, fall back to mock prompts
        setPrompts(MOCK_PROMPTS)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrompts()
  }, [user, isMockMode])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Prompts</CardTitle>
          <CardDescription>Your recently used prompts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Prompts</CardTitle>
        <CardDescription>Your recently used prompts</CardDescription>
      </CardHeader>
      <CardContent>
        {prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">No prompts to display</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prompts.map((prompt) => (
              <div key={prompt.id} className="space-y-1">
                <p className="text-sm line-clamp-2">{prompt.content}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{prompt.model}</span>
                  <span>{formatDistanceToNow(new Date(prompt.created_at), { addSuffix: true })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

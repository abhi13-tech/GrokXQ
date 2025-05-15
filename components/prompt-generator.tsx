"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { PromptDisplay } from "@/components/prompt-display"
import { PromptHistory } from "@/components/prompt-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModelSelector } from "@/components/model-selector"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

const formSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  promptType: z.string(),
  tone: z.string(),
  length: z.number().min(10).max(100),
  additionalContext: z.string().optional(),
  model: z.string(),
  projectId: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type PromptHistoryItem = {
  id: string
  topic: string
  prompt_type: string
  tone: string
  generated_prompt: string
  created_at: string
}

export function PromptGenerator() {
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [promptHistory, setPromptHistory] = useState<PromptHistoryItem[]>([])
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      promptType: "writing",
      tone: "professional",
      length: 50,
      additionalContext: "",
      model: "groq-llama-3.1-8b-instant",
      projectId: "",
    },
  })

  // Fetch user's prompt history and projects
  useEffect(() => {
    if (user) {
      const fetchPromptHistory = async () => {
        setIsLoadingHistory(true)
        try {
          const { data, error } = await supabase
            .from("prompts")
            .select("id, topic, prompt_type, tone, generated_prompt, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(10)

          if (error) {
            throw error
          }

          setPromptHistory(data || [])
        } catch (error) {
          console.error("Error fetching prompt history:", error)
        } finally {
          setIsLoadingHistory(false)
        }
      }

      const fetchProjects = async () => {
        try {
          const { data, error } = await supabase
            .from("projects")
            .select("id, name")
            .eq("user_id", user.id)
            .order("name")

          if (error) {
            throw error
          }

          setProjects(data || [])
        } catch (error) {
          console.error("Error fetching projects:", error)
        }
      }

      fetchPromptHistory()
      fetchProjects()
    }
  }, [user])

  async function onSubmit(data: FormValues) {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userId: user?.id,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate prompt: ${response.statusText}`)
      }

      const result = await response.json()
      setGeneratedPrompt(result.prompt)

      // Refresh prompt history after generating a new prompt
      if (user) {
        const { data: newHistory, error } = await supabase
          .from("prompts")
          .select("id, topic, prompt_type, tone, generated_prompt, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10)

        if (!error && newHistory) {
          setPromptHistory(newHistory)
        }
      }

      toast({
        title: "Prompt generated successfully",
        description: "Your prompt has been generated and saved to history.",
      })
    } catch (error) {
      console.error("Error generating prompt:", error)
      toast({
        title: "Error generating prompt",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const selectPrompt = (prompt: string) => {
    setGeneratedPrompt(prompt)
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Configure Your Prompt</CardTitle>
          <CardDescription>Adjust the parameters below to generate a customized AI prompt</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Climate change, Machine learning, Creative writing" {...field} />
                    </FormControl>
                    <FormDescription>The main subject of your prompt</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="promptType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a prompt type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="writing">Writing</SelectItem>
                          <SelectItem value="coding">Coding</SelectItem>
                          <SelectItem value="brainstorming">Brainstorming</SelectItem>
                          <SelectItem value="analysis">Analysis</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>The type of task you want to accomplish</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>The tone of the generated prompt</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length: {field.value}%</FormLabel>
                    <FormControl>
                      <Slider
                        min={10}
                        max={100}
                        step={5}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormDescription>Adjust the relative length of the generated prompt</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Context (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any specific requirements, constraints, or additional information"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Provide any additional details to make the prompt more specific</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AI Model</FormLabel>
                      <FormControl>
                        <ModelSelector value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormDescription>Select the AI model to generate your prompt</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {user && projects.length > 0 && (
                  <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {projects.map((project) => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Associate this prompt with a project</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Prompt"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Tabs defaultValue="current">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current Prompt</TabsTrigger>
          <TabsTrigger value="history">Prompt History</TabsTrigger>
        </TabsList>
        <TabsContent value="current">
          <PromptDisplay prompt={generatedPrompt} />
        </TabsContent>
        <TabsContent value="history">
          <PromptHistory
            prompts={promptHistory}
            onSelectPrompt={(prompt) => selectPrompt(prompt)}
            isLoading={isLoadingHistory}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

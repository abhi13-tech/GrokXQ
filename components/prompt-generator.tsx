"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Loader2, Sparkles, History } from "lucide-react"
import { motion } from "framer-motion"
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
import { Badge } from "@/components/ui/badge"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { useApi } from "@/hooks/use-api"
import { promptGenerationSchema } from "@/lib/validation-schemas"
import type { z } from "zod"

type FormValues = z.infer<typeof promptGenerationSchema>

type PromptHistoryItem = {
  id: string
  topic: string
  prompt_type: string
  tone: string
  generated_prompt: string
  created_at: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
}

export function PromptGenerator() {
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("")
  const [promptHistory, setPromptHistory] = useState<PromptHistoryItem[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const { execute, isLoading: isGenerating } = useApi<{ prompt: string }>()

  const form = useForm<FormValues>({
    resolver: zodResolver(promptGenerationSchema),
    defaultValues: {
      topic: "",
      promptType: "writing",
      tone: "professional",
      length: 50,
      additionalContext: "",
      model: "groq-llama-3.1-8b-instant",
    },
  })

  // Fetch user's prompt history
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
          toast({
            title: "Error fetching history",
            description: "Failed to load your prompt history. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoadingHistory(false)
        }
      }

      fetchPromptHistory()
    }
  }, [user, toast])

  async function onSubmit(data: FormValues) {
    const result = await execute(
      () =>
        fetch("/api/generate-prompt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            userId: user?.id,
          }),
        }),
      {
        successMessage: "Prompt generated successfully",
        errorMessage: "Failed to generate prompt. Please try again.",
        onSuccess: (data) => {
          setGeneratedPrompt(data.prompt)
          refreshPromptHistory()
        },
      },
    )
  }

  const refreshPromptHistory = async () => {
    if (!user) return

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
      console.error("Error refreshing prompt history:", error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const selectPrompt = (prompt: string) => {
    setGeneratedPrompt(prompt)
  }

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="bg-black/20 backdrop-blur-sm">
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Configure Your Prompt
            </CardTitle>
            <CardDescription className="text-slate-300">
              Adjust the parameters below to generate a customized AI prompt
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Topic</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g., Climate change, Machine learning, Creative writing"
                          {...field}
                          className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                        />
                      </FormControl>
                      <FormDescription className="text-slate-400">The main subject of your prompt</FormDescription>
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
                        <FormLabel className="text-slate-300">Prompt Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                              <SelectValue placeholder="Select a prompt type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                            <SelectItem value="writing">Writing</SelectItem>
                            <SelectItem value="coding">Coding</SelectItem>
                            <SelectItem value="brainstorming">Brainstorming</SelectItem>
                            <SelectItem value="analysis">Analysis</SelectItem>
                            <SelectItem value="creative">Creative</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-slate-400">
                          The type of task you want to accomplish
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Tone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                              <SelectValue placeholder="Select a tone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-slate-400">The tone of the generated prompt</FormDescription>
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
                      <div className="flex justify-between items-center">
                        <FormLabel className="text-slate-300">Length</FormLabel>
                        <Badge variant="outline" className="text-blue-400 border-blue-500/50 bg-blue-500/10">
                          {field.value}%
                        </Badge>
                      </div>
                      <FormControl>
                        <Slider
                          min={10}
                          max={100}
                          step={5}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-4"
                        />
                      </FormControl>
                      <FormDescription className="text-slate-400">
                        Adjust the relative length of the generated prompt
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalContext"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Additional Context (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any specific requirements, constraints, or additional information"
                          className="resize-none bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-slate-400">
                        Provide any additional details to make the prompt more specific
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">AI Model</FormLabel>
                      <FormControl>
                        <ModelSelector value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormDescription className="text-slate-400">
                        Select the AI model to generate your prompt
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 shadow-[0_0_15px_rgba(56,189,248,0.5)] hover:shadow-[0_0_25px_rgba(56,189,248,0.7)]"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Prompt
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 p-1 rounded-lg">
            <TabsTrigger
              value="current"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all"
            >
              Current Prompt
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all"
            >
              <History className="mr-2 h-4 w-4" />
              Prompt History
            </TabsTrigger>
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
      </motion.div>
    </motion.div>
  )
}

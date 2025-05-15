"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModelSelector } from "@/components/model-selector"
import { CodeReviewDisplay } from "@/components/code-review-display"

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
]

const REVIEW_TYPES = [
  { value: "general", label: "General Review" },
  { value: "security", label: "Security Audit" },
  { value: "performance", label: "Performance Optimization" },
  { value: "readability", label: "Readability & Style" },
  { value: "bugs", label: "Bug Detection" },
]

type FormValues = {
  code: string
  language: string
  reviewType: string
  model: string
}

export function CodeReviewer() {
  const [isReviewing, setIsReviewing] = useState<boolean>(false)
  const [reviewResult, setReviewResult] = useState<string>("")

  const form = useForm<FormValues>({
    defaultValues: {
      code: "",
      language: "javascript",
      reviewType: "general",
      model: "groq-llama-3.1-8b-instant",
    },
  })

  async function onSubmit(data: FormValues) {
    if (!data.code.trim()) return

    setIsReviewing(true)
    try {
      const response = await fetch("/api/review-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to review code")
      }

      const result = await response.json()
      setReviewResult(result.review)
    } catch (error) {
      console.error("Error reviewing code:", error)
    } finally {
      setIsReviewing(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Code Review</CardTitle>
          <CardDescription>Paste your code and get AI-powered feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Programming language of your code</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reviewType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select review type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {REVIEW_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Type of review to perform</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AI Model</FormLabel>
                      <FormControl>
                        <ModelSelector value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormDescription>Select the AI model</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Code</FormLabel>
                    <FormControl>
                      <div className="min-h-[400px] border rounded-md">
                        <textarea
                          className="w-full h-[400px] p-4 font-mono text-sm resize-none focus:outline-none bg-background"
                          placeholder="Paste or type your code here..."
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Paste or type your code here</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isReviewing || !form.watch("code").trim()} className="w-full">
                {isReviewing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reviewing...
                  </>
                ) : (
                  "Review Code"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {reviewResult && <CodeReviewDisplay review={reviewResult} />}
    </div>
  )
}

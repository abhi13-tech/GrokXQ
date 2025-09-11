"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { ModelSelector } from "@/components/model-selector"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// Define a schema for form validation
const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  language: z.string(),
  reviewType: z.string(),
  model: z.string(),
})

type FormValues = z.infer<typeof formSchema>

export function CodeReviewForm() {
  const [isReviewing, setIsReviewing] = useState(false)
  const [reviewResult, setReviewResult] = useState("")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      language: "typescript",
      reviewType: "general",
      model: "groq-llama-3.1-8b-instant",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsReviewing(true)

    // Simulate API call
    setTimeout(() => {
      const sampleReview = `## Code Review: TypeScript Component

### Summary
The code implements a React component called \`DataDisplay\` that fetches and displays a list of data items with appropriate loading and error states.

### Strengths
- ✅ Good use of TypeScript with proper interface definition
- ✅ Implements loading and error states
- ✅ Uses React hooks correctly (useState, useEffect)
- ✅ Handles fetch errors appropriately

### Areas for Improvement

#### Error Handling
- Consider adding more specific error handling for different HTTP status codes
- The error message could be more user-friendly

\`\`\`typescript
// Before
if (!response.ok) {
  throw new Error('Failed to fetch data');
}

// After
if (!response.ok) {
  if (response.status === 404) {
    throw new Error('The requested data could not be found');
  } else if (response.status === 403) {
    throw new Error('You do not have permission to access this data');
  } else {
    throw new Error(\`Failed to fetch data: \${response.statusText}\`);
  }
}
\`\`\`

#### Performance Optimization
- Consider adding a dependency array to prevent unnecessary re-renders
- Implement pagination or virtualization for large data sets

#### Accessibility
- Add ARIA attributes for better screen reader support
- Improve the loading and error states with more descriptive messages

### Security Considerations
- Validate the data received from the API before rendering
- Consider implementing rate limiting for the API calls

### Overall Assessment
The code is well-structured and follows React best practices. With a few improvements to error handling, performance, and accessibility, it would be production-ready.`

      setReviewResult(sampleReview)
      setIsReviewing(false)
    }, 2000)
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Code Review</CardTitle>
          <CardDescription>Submit your code for AI-powered review and feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="csharp">C#</SelectItem>
                          <SelectItem value="go">Go</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Select the programming language.</FormDescription>
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
                          <SelectItem value="general">General Review</SelectItem>
                          <SelectItem value="security">Security Audit</SelectItem>
                          <SelectItem value="performance">Performance Optimization</SelectItem>
                          <SelectItem value="readability">Readability & Style</SelectItem>
                          <SelectItem value="bugs">Bug Detection</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Select the type of review to perform.</FormDescription>
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
                      <FormDescription>Select the AI model to use for code review.</FormDescription>
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
                      <Textarea placeholder="Paste your code here..." className="font-mono min-h-[300px]" {...field} />
                    </FormControl>
                    <FormDescription>Paste the code you want to review.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isReviewing || !form.watch("code")}>
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

      {reviewResult && (
        <Card>
          <CardHeader>
            <CardTitle>Review Results</CardTitle>
            <CardDescription>AI-generated feedback on your code.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="formatted">
              <TabsList className="mb-4">
                <TabsTrigger value="formatted">Formatted</TabsTrigger>
                <TabsTrigger value="raw">Raw Markdown</TabsTrigger>
              </TabsList>
              <TabsContent value="formatted">
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{reviewResult}</ReactMarkdown>
                </div>
              </TabsContent>
              <TabsContent value="raw">
                <pre className="max-h-[500px] overflow-auto rounded-lg bg-muted p-4 font-mono text-sm">
                  {reviewResult}
                </pre>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Save Review</Button>
            <Button variant="outline">Export as PDF</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

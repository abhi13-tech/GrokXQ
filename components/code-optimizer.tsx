"use client"

import { Textarea } from "@/components/ui/textarea"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ModelSelector } from "@/components/model-selector"
import ReactMarkdown from "react-markdown"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Checkbox } from "@/components/ui/checkbox"

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

const OPTIMIZATION_GOALS = [
  { id: "performance", label: "Performance" },
  { id: "readability", label: "Readability" },
  { id: "security", label: "Security" },
  { id: "maintainability", label: "Maintainability" },
  { id: "modernize", label: "Modernize Syntax" },
]

// Define a schema for form validation
const formSchema = z.object({
  language: z.string(),
  model: z.string(),
  goals: z.array(z.string()).min(1, "Select at least one optimization goal"),
  code: z.string().min(1, "Code is required"),
})

type FormValues = z.infer<typeof formSchema>

export function CodeOptimizer() {
  const [optimizedCode, setOptimizedCode] = useState<string>("")
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false)
  const [explanation, setExplanation] = useState<string>("")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: "javascript",
      model: "groq-llama-3.1-8b-instant",
      goals: ["performance", "readability"],
      code: "",
    },
  })

  async function onSubmit(data: FormValues) {
    if (!data.code.trim()) return

    setIsOptimizing(true)
    try {
      // Simulate API call
      setTimeout(() => {
        const optimizedCodeSample = `// Optimized version
import { useState, useEffect, useCallback } from 'react';

interface DataItem {
  id: number;
  name: string;
  value: number;
}

export function DataDisplay() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/data');
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('The requested data could not be found');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to access this data');
        } else {
          throw new Error(\`Failed to fetch data: \${response.statusText}\`);
        }
      }
      
      const result = await response.json();
      
      // Validate the data
      if (!Array.isArray(result)) {
        throw new Error('Invalid data format received');
      }
      
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return (
    <div role="status" aria-live="polite" className="flex items-center justify-center p-4">
      <div className="animate-spin mr-2">⏳</div>
      <span>Loading data...</span>
    </div>
  );
  
  if (error) return (
    <div role="alert" className="text-red-500 p-4 border border-red-200 rounded">
      Error: {error}
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold" id="data-items-heading">Data Items</h2>
      {data.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul className="divide-y" aria-labelledby="data-items-heading">
          {data.map((item) => (
            <li key={item.id} className="py-2">
              <div className="flex justify-between">
                <span className="font-medium">{item.name}</span>
                <span>{item.value}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`

        const explanationSample = `# Code Optimization Explanation

## Performance Improvements

1. **Added useCallback for fetchData function**
   - Prevents unnecessary re-creation of the function on each render
   - Helps optimize dependency arrays in useEffect

2. **Added proper error handling with specific error messages**
   - Different HTTP status codes now have specific error messages
   - Improves debugging and user experience

3. **Added data validation**
   - Ensures the API returns the expected data format
   - Prevents rendering errors with invalid data

## Readability Improvements

1. **Better code organization**
   - Logical grouping of related code
   - Consistent formatting and spacing

2. **Improved conditional rendering**
   - Clear separation between loading, error, and data states
   - Added empty state handling when data array is empty

3. **Descriptive variable names**
   - All variables have clear, descriptive names
   - Makes the code more self-documenting

## Accessibility Improvements

1. **Added ARIA attributes**
   - role="status" and aria-live="polite" for loading state
   - role="alert" for error messages
   - aria-labelledby for connecting the heading with the list

2. **Improved loading indicator**
   - Added visual spinner with text
   - Better user experience for screen readers

## Security Improvements

1. **Added data validation**
   - Checks that the API response is an array before processing
   - Prevents potential security issues from unexpected data formats

## Modernization

1. **Used modern React patterns**
   - Functional components with hooks
   - useCallback for memoization
   - Proper dependency arrays in useEffect

2. **Used modern CSS with utility classes**
   - Responsive design patterns
   - Consistent spacing and styling`

        setOptimizedCode(optimizedCodeSample)
        setExplanation(explanationSample)
        setIsOptimizing(false)
      }, 2000)
    } catch (error) {
      console.error("Error optimizing code:", error)
      setIsOptimizing(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Code Optimizer</CardTitle>
          <CardDescription>Paste your code and get an optimized version</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="goals"
                render={() => (
                  <FormItem>
                    <FormLabel>Optimization Goals</FormLabel>
                    <FormDescription>Select optimization goals for your code</FormDescription>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                      {OPTIMIZATION_GOALS.map((goal) => (
                        <FormField
                          key={goal.id}
                          control={form.control}
                          name="goals"
                          render={({ field }) => {
                            return (
                              <FormItem key={goal.id} className="flex flex-row items-start space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(goal.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, goal.id])
                                        : field.onChange(field.value?.filter((value) => value !== goal.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">{goal.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Code</FormLabel>
                    <FormControl>
                      <Textarea
                        className="w-full h-[300px] p-4 font-mono text-sm resize-none focus:outline-none bg-background"
                        placeholder="Paste or type your code here..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Paste or type your code here</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isOptimizing || !form.watch("code").trim() || form.watch("goals").length === 0}
                className="w-full"
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  "Optimize Code"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {optimizedCode && (
        <Tabs defaultValue="optimized">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="optimized">Optimized Code</TabsTrigger>
            <TabsTrigger value="explanation">Explanation</TabsTrigger>
          </TabsList>
          <TabsContent value="optimized">
            <Card>
              <CardHeader>
                <CardTitle>Optimized Code</CardTitle>
                <CardDescription>AI-optimized version of your code</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[300px] border rounded-md">
                  <textarea
                    className="w-full h-[300px] p-4 font-mono text-sm resize-none focus:outline-none bg-background"
                    value={optimizedCode}
                    readOnly
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="explanation">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Explanation</CardTitle>
                <CardDescription>Details about the changes made to your code</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{explanation}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

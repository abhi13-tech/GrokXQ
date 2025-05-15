"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useForm } from "react-hook-form"
import { Loader2, Copy, Check } from "lucide-react"
import { ModelSelector } from "@/components/model-selector"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// Define a schema for form validation
const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  language: z.string(),
  framework: z.string(),
  model: z.string(),
  additionalContext: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function CodeGenerationForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [copied, setCopied] = useState(false)

  // Initialize form with zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      language: "typescript",
      framework: "react",
      model: "groq-llama-3.1-8b-instant",
      additionalContext: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsGenerating(true)

    // Simulate API call
    setTimeout(() => {
      const sampleCode = `// Generated ${data.language} code using ${data.framework}
import { useState, useEffect } from 'react';

interface DataItem {
  id: number;
  name: string;
  value: number;
}

export function DataDisplay() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Data Items</h2>
      <ul className="divide-y">
        {data.map((item) => (
          <li key={item.id} className="py-2">
            <div className="flex justify-between">
              <span className="font-medium">{item.name}</span>
              <span>{item.value}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}`

      setGeneratedCode(sampleCode)
      setIsGenerating(false)
    }, 2000)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Code</CardTitle>
          <CardDescription>Describe what you want to create and our AI will generate the code for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the component or function you want to create. E.g., 'A React component that fetches and displays a list of data items with loading and error states.'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Be as specific as possible about what you want to create.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  name="framework"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Framework</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select framework" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="react">React</SelectItem>
                          <SelectItem value="nextjs">Next.js</SelectItem>
                          <SelectItem value="vue">Vue</SelectItem>
                          <SelectItem value="angular">Angular</SelectItem>
                          <SelectItem value="svelte">Svelte</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Select the framework (if applicable).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Model</FormLabel>
                    <FormControl>
                      <ModelSelector value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormDescription>Select the AI model to use for code generation.</FormDescription>
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
                        placeholder="Add any specific requirements, constraints, or additional information."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide any additional details to make the generated code more specific.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Code"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {generatedCode && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Code</CardTitle>
            <CardDescription>Review and copy the generated code.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="code">
              <TabsList className="mb-4">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="code">
                <div className="relative">
                  <pre className="max-h-[500px] overflow-auto rounded-lg bg-muted p-4 font-mono text-sm">
                    {generatedCode}
                  </pre>
                  <Button size="sm" variant="ghost" className="absolute right-4 top-4" onClick={copyToClipboard}>
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="preview">
                <div className="rounded-lg border p-4">
                  <p className="text-muted-foreground">Preview not available for this code.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Save to Project</Button>
            <Button variant="outline">Generate Tests</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

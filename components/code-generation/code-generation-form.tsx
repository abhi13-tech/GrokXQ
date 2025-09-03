"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { Loader2, Sparkles, Copy, Check, Download, Code, FileCode, Play } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModelSelector } from "@/components/model-selector"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// Define a schema for form validation
const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  language: z.string(),
  framework: z.string(),
  model: z.string(),
  additionalContext: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

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

export function CodeGenerationForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const codeRef = useRef<HTMLPreElement>(null)

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

    try {
      // In a real implementation, this would be an API call
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate code: ${response.statusText}`)
      }

      const result = await response.json()
      setGeneratedCode(result.code)

      toast({
        title: "Code generated successfully",
        description: "Your code has been generated.",
      })
    } catch (error) {
      console.error("Error generating code:", error)
      toast({
        title: "Error generating code",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Copied to clipboard",
        description: "The code has been copied to your clipboard",
      })
    } catch (err) {
      console.error("Failed to copy text: ", err)
      toast({
        title: "Failed to copy",
        description: "Could not copy the code to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadCode = () => {
    try {
      const element = document.createElement("a")
      const file = new Blob([generatedCode], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = `generated-code.${form.getValues("language") === "typescript" ? "tsx" : "js"}`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      toast({
        title: "Downloaded code",
        description: "The code has been downloaded",
      })
    } catch (err) {
      console.error("Failed to download code: ", err)
      toast({
        title: "Failed to download",
        description: "Could not download the code",
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div className="grid gap-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="bg-black/20 backdrop-blur-sm">
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Generate Code
            </CardTitle>
            <CardDescription className="text-slate-300">
              Describe what you want to create and our AI will generate the code for you
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the component or function you want to create. E.g., 'A React component that fetches and displays a list of data items with loading and error states.'"
                          className="min-h-[100px] bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-slate-400">
                        Be as specific as possible about what you want to create.
                      </FormDescription>
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
                        <FormLabel className="text-slate-300">Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                            <SelectItem value="javascript">JavaScript</SelectItem>
                            <SelectItem value="typescript">TypeScript</SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="java">Java</SelectItem>
                            <SelectItem value="csharp">C#</SelectItem>
                            <SelectItem value="go">Go</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-slate-400">Select the programming language.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="framework"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Framework</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                              <SelectValue placeholder="Select framework" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                            <SelectItem value="react">React</SelectItem>
                            <SelectItem value="nextjs">Next.js</SelectItem>
                            <SelectItem value="vue">Vue</SelectItem>
                            <SelectItem value="angular">Angular</SelectItem>
                            <SelectItem value="svelte">Svelte</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-slate-400">
                          Select the framework (if applicable).
                        </FormDescription>
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
                      <FormLabel className="text-slate-300">AI Model</FormLabel>
                      <FormControl>
                        <div className="w-full">
                          <ModelSelector
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-slate-400">
                        Select the AI model to use for code generation.
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
                          placeholder="Add any specific requirements, constraints, or additional information."
                          className="min-h-[100px] bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-slate-400">
                        Provide any additional details to make the generated code more specific.
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
                      <Code className="mr-2 h-4 w-4" />
                      Generate Code
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {generatedCode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            variants={itemVariants}
          >
            <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg dark:from-slate-950 dark:to-slate-900">
              <CardHeader className="bg-black/20 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-200">Generated Code</CardTitle>
                    <CardDescription className="text-slate-300">Review and copy the generated code</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                      {form.getValues("framework")}
                    </Badge>
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                      {form.getValues("language")}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="code" className="w-full">
                  <TabsList className="bg-slate-800/50 p-1 rounded-lg mb-4">
                    <TabsTrigger
                      value="code"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all"
                    >
                      <FileCode className="mr-2 h-4 w-4" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger
                      value="preview"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="code">
                    <div className="relative">
                      <div className="absolute top-2 right-2 bg-slate-800 rounded px-2 py-1 text-xs text-slate-400 font-mono">
                        {generatedCode ? generatedCode.split("\n").length : 0} lines
                      </div>
                      <pre
                        ref={codeRef}
                        className="max-h-[500px] overflow-auto rounded-lg bg-slate-800/50 p-4 font-mono text-sm text-slate-200 border border-slate-700"
                      >
                        {generatedCode}
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-4 top-4 bg-slate-800/80 hover:bg-slate-700 text-slate-200"
                        onClick={copyToClipboard}
                      >
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
                    <div className="rounded-lg border border-slate-700 p-6 bg-slate-800/30 text-center">
                      <p className="text-slate-300 mb-4">Preview not available for this code.</p>
                      <p className="text-slate-400 text-sm">
                        To preview this code, please copy it to your development environment and run it.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="bg-black/20 backdrop-blur-sm px-6 py-4 flex flex-wrap gap-2 justify-between">
                <Button
                  variant="outline"
                  className="bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
                >
                  Save to Project
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
                    onClick={downloadCode}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-blue-600/20 border-blue-500/50 text-blue-400 hover:bg-blue-600/30 hover:text-blue-300 transition-all"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Tests
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

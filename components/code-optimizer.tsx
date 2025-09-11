"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { Loader2, Code, Sparkles, ArrowRight, Copy, Check, Download } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ModelSelector } from "@/components/model-selector"
import ReactMarkdown from "react-markdown"
import { zodResolver } from "@hookform/resolvers/zod"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useApi } from "@/hooks/use-api"
import { codeOptimizationSchema } from "@/lib/validation-schemas"
import type { z } from "zod"

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

type FormValues = z.infer<typeof codeOptimizationSchema>

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

export function CodeOptimizer() {
  const [optimizedCode, setOptimizedCode] = useState<string>("")
  const [explanation, setExplanation] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const codeRef = useRef<HTMLPreElement>(null)
  const { execute, isLoading: isOptimizing } = useApi<{ optimizedCode: string; explanation: string }>()

  const form = useForm<FormValues>({
    resolver: zodResolver(codeOptimizationSchema),
    defaultValues: {
      language: "javascript",
      model: "groq-llama-3.1-8b-instant",
      goals: ["performance", "readability"],
      code: "",
    },
  })

  async function onSubmit(data: FormValues) {
    const result = await execute(
      () =>
        fetch("/api/optimize-code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }),
      {
        successMessage: "Code optimized successfully",
        errorMessage: "Failed to optimize code. Please try again.",
        onSuccess: (data) => {
          setOptimizedCode(data.optimizedCode)
          setExplanation(data.explanation)
        },
      },
    )
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(optimizedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Copied to clipboard",
        description: "The optimized code has been copied to your clipboard",
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
      const file = new Blob([optimizedCode], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = `optimized-code.${form.getValues("language")}`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      toast({
        title: "Downloaded code",
        description: "The optimized code has been downloaded",
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
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="bg-black/20 backdrop-blur-sm">
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Code Optimizer
            </CardTitle>
            <CardDescription className="text-slate-300">Paste your code and get an optimized version</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            {LANGUAGES.map((lang) => (
                              <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-slate-400">Programming language of your code</FormDescription>
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
                        <FormDescription className="text-slate-400">Select the AI model</FormDescription>
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
                      <FormLabel className="text-slate-300">Optimization Goals</FormLabel>
                      <FormDescription className="text-slate-400">
                        Select optimization goals for your code
                      </FormDescription>
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
                                      className="border-slate-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal cursor-pointer text-slate-300">
                                    {goal.label}
                                  </FormLabel>
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
                      <FormLabel className="text-slate-300">Your Code</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute top-2 right-2 bg-slate-800 rounded px-2 py-1 text-xs text-slate-400 font-mono">
                            {field.value ? field.value.split("\n").length : 0} lines
                          </div>
                          <textarea
                            className="w-full h-[300px] p-4 font-mono text-sm resize-none focus:outline-none bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all rounded-md"
                            placeholder="Paste or type your code here..."
                            {...field}
                            aria-label="Code input"
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-slate-400">Paste or type your code here</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isOptimizing || !form.watch("code").trim() || form.watch("goals").length === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 shadow-[0_0_15px_rgba(56,189,248,0.5)] hover:shadow-[0_0_25px_rgba(56,189,248,0.7)]"
                  aria-label={isOptimizing ? "Optimizing code..." : "Optimize code"}
                >
                  {isOptimizing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Optimize Code
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {optimizedCode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Tabs defaultValue="optimized" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 p-1 rounded-lg">
                <TabsTrigger
                  value="optimized"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all"
                >
                  <Code className="mr-2 h-4 w-4" />
                  Optimized Code
                </TabsTrigger>
                <TabsTrigger
                  value="explanation"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Explanation
                </TabsTrigger>
              </TabsList>
              <TabsContent value="optimized">
                <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg dark:from-slate-950 dark:to-slate-900">
                  <CardHeader className="bg-black/20 backdrop-blur-sm">
                    <CardTitle className="text-xl font-bold text-slate-200">Optimized Code</CardTitle>
                    <CardDescription className="text-slate-300">AI-optimized version of your code</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="relative">
                      <div className="absolute top-2 right-2 bg-slate-800 rounded px-2 py-1 text-xs text-slate-400 font-mono">
                        {optimizedCode ? optimizedCode.split("\n").length : 0} lines
                      </div>
                      <pre
                        ref={codeRef}
                        className="w-full h-[300px] p-4 font-mono text-sm overflow-auto bg-slate-800/50 border border-slate-700 text-slate-200 rounded-md"
                        aria-label="Optimized code output"
                      >
                        {optimizedCode}
                      </pre>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-black/20 backdrop-blur-sm px-6 py-4 flex flex-wrap gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
                      onClick={downloadCode}
                      aria-label="Download optimized code"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-blue-600/20 border-blue-500/50 text-blue-400 hover:bg-blue-600/30 hover:text-blue-300 transition-all ml-auto"
                      onClick={copyToClipboard}
                      disabled={copied}
                      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
                    >
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy to Clipboard
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="explanation">
                <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg dark:from-slate-950 dark:to-slate-900">
                  <CardHeader className="bg-black/20 backdrop-blur-sm">
                    <CardTitle className="text-xl font-bold text-slate-200">Optimization Explanation</CardTitle>
                    <CardDescription className="text-slate-300">
                      Details about the changes made to your code
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="prose dark:prose-invert max-w-none text-slate-200 prose-headings:text-slate-100 prose-a:text-blue-400 prose-strong:text-slate-100 prose-code:text-blue-300 prose-pre:bg-slate-800 prose-pre:text-slate-200">
                      <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

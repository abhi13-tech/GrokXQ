"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { Loader2, Copy, Check, Download, GitPullRequest } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModelSelector } from "@/components/model-selector"
import { CodeReviewDisplay } from "@/components/code-review-display"
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

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

// Define a schema for form validation
const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  language: z.string(),
  reviewType: z.string(),
  model: z.string(),
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

export function CodeReviewer() {
  const [isReviewing, setIsReviewing] = useState<boolean>(false)
  const [reviewResult, setReviewResult] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const reviewRef = useRef<HTMLDivElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
        throw new Error(`Failed to review code: ${response.statusText}`)
      }

      const result = await response.json()
      setReviewResult(result.review)

      toast({
        title: "Code review completed",
        description: "Your code has been reviewed successfully",
      })
    } catch (error) {
      console.error("Error reviewing code:", error)
      toast({
        title: "Error reviewing code",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsReviewing(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(reviewResult)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Copied to clipboard",
        description: "The review has been copied to your clipboard",
      })
    } catch (err) {
      console.error("Failed to copy text: ", err)
      toast({
        title: "Failed to copy",
        description: "Could not copy the review to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadReview = () => {
    try {
      const element = document.createElement("a")
      const file = new Blob([reviewResult], { type: "text/markdown" })
      element.href = URL.createObjectURL(file)
      element.download = "code-review.md"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      toast({
        title: "Downloaded review",
        description: "The code review has been downloaded as a markdown file",
      })
    } catch (err) {
      console.error("Failed to download review: ", err)
      toast({
        title: "Failed to download",
        description: "Could not download the review",
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
              Code Review
            </CardTitle>
            <CardDescription className="text-slate-300">Paste your code and get AI-powered feedback</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    name="reviewType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Review Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                              <SelectValue placeholder="Select review type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                            {REVIEW_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-slate-400">Type of review to perform</FormDescription>
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
                            className="w-full h-[400px] p-4 font-mono text-sm resize-none focus:outline-none bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all rounded-md"
                            placeholder="Paste or type your code here..."
                            {...field}
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
                  disabled={isReviewing || !form.watch("code").trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 shadow-[0_0_15px_rgba(56,189,248,0.5)] hover:shadow-[0_0_25px_rgba(56,189,248,0.7)]"
                >
                  {isReviewing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Reviewing...
                    </>
                  ) : (
                    <>
                      <GitPullRequest className="mr-2 h-4 w-4" />
                      Review Code
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {reviewResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg dark:from-slate-950 dark:to-slate-900">
              <CardHeader className="bg-black/20 backdrop-blur-sm">
                <CardTitle className="text-xl font-bold text-slate-200">Code Review Results</CardTitle>
                <CardDescription className="text-slate-300">AI-generated feedback on your code</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div
                  className="prose dark:prose-invert max-w-none text-slate-200 prose-headings:text-slate-100 prose-a:text-blue-400 prose-strong:text-slate-100 prose-code:text-blue-300 prose-pre:bg-slate-800 prose-pre:text-slate-200"
                  ref={reviewRef}
                >
                  <CodeReviewDisplay review={reviewResult} />
                </div>
              </CardContent>
              <CardFooter className="bg-black/20 backdrop-blur-sm px-6 py-4 flex flex-wrap gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
                  onClick={downloadReview}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download as Markdown
                </Button>
                <Button
                  variant="outline"
                  className="bg-blue-600/20 border-blue-500/50 text-blue-400 hover:bg-blue-600/30 hover:text-blue-300 transition-all ml-auto"
                  onClick={copyToClipboard}
                  disabled={copied}
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

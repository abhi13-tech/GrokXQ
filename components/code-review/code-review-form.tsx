"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, GitPullRequest, Check, Copy, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ErrorHandler } from "@/lib/error-handler"

export function CodeReviewForm() {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [reviewType, setReviewType] = useState("general")
  const [model, setModel] = useState("groq-llama-3.1-8b-instant")
  const [isReviewing, setIsReviewing] = useState(false)
  const [review, setReview] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code to review",
        variant: "destructive",
      })
      return
    }

    setIsReviewing(true)
    setReview("")

    try {
      const response = await fetch("/api/review-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          reviewType,
          model,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to review code: ${response.status}`)
      }

      const data = await response.json()
      setReview(data.review || "No review generated. Please try again.")

      toast({
        title: "Code review completed",
        description: `Review generated using ${model}`,
      })
    } catch (error) {
      console.error("Error reviewing code:", error)
      ErrorHandler.handleApiError(error)

      // Fallback to sample review for demo purposes
      setTimeout(() => {
        const sampleReview = `## Code Review: ${language.charAt(0).toUpperCase() + language.slice(1)} Code

### Summary
The code appears to be a ${language} implementation with some potential areas for improvement.

### Strengths
- Good overall structure
- Clear variable naming
- Proper use of language features

### Areas for Improvement

#### Error Handling
- Consider adding more robust error handling
- Implement try/catch blocks where appropriate

#### Performance Optimization
- There are opportunities to improve performance
- Consider caching results of expensive operations

#### Code Style
- Follow consistent formatting
- Add more comments to explain complex logic

### Security Considerations
- Validate all inputs
- Be cautious with any external data sources

### Overall Assessment
The code is functional but could benefit from the improvements mentioned above.`

        setReview(sampleReview)
        toast({
          title: "Using fallback review",
          description: "Could not connect to AI service, showing sample review",
          variant: "warning",
        })
      }, 1500)
    } finally {
      setIsReviewing(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(review)
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
      const file = new Blob([review], { type: "text/markdown" })
      element.href = URL.createObjectURL(file)
      element.download = `code-review-${new Date().toISOString().slice(0, 10)}.md`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      toast({
        title: "Downloaded review",
        description: "The review has been downloaded as a markdown file",
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
    <div className="grid gap-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg">
        <CardHeader className="bg-black/20 backdrop-blur-sm">
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Code Review
          </CardTitle>
          <CardDescription className="text-slate-300">
            Get expert feedback on your code to improve quality and catch issues
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-slate-300 mb-1">
                Your Code
              </label>
              <Textarea
                id="code"
                placeholder="Paste your code here..."
                className="min-h-[200px] font-mono bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-slate-300 mb-1">
                  Language
                </label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="csharp">C#</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                    <SelectItem value="php">PHP</SelectItem>
                    <SelectItem value="ruby">Ruby</SelectItem>
                    <SelectItem value="swift">Swift</SelectItem>
                    <SelectItem value="kotlin">Kotlin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="reviewType" className="block text-sm font-medium text-slate-300 mb-1">
                  Review Type
                </label>
                <Select value={reviewType} onValueChange={setReviewType}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                    <SelectValue placeholder="Select review type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                    <SelectItem value="general">General Review</SelectItem>
                    <SelectItem value="security">Security Review</SelectItem>
                    <SelectItem value="performance">Performance Review</SelectItem>
                    <SelectItem value="readability">Readability Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="model" className="block text-sm font-medium text-slate-300 mb-1">
                  AI Model
                </label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                    <SelectItem value="groq-llama-3.1-8b-instant">Llama 3.1 8B</SelectItem>
                    <SelectItem value="groq-mixtral-8x7b-32768">Mixtral 8x7B</SelectItem>
                    <SelectItem value="groq-gemma-7b-it">Gemma 7B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 shadow-[0_0_15px_rgba(56,189,248,0.5)] hover:shadow-[0_0_25px_rgba(56,189,248,0.7)]"
              disabled={isReviewing}
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
        </CardContent>
      </Card>

      {review && (
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg">
          <CardHeader className="bg-black/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-200">Code Review Results</CardTitle>
                <CardDescription className="text-slate-300">Expert feedback on your code</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                  {language}
                </Badge>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                  {reviewType}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="review" className="w-full">
              <TabsList className="bg-slate-800/50 p-1 rounded-lg mb-4">
                <TabsTrigger
                  value="review"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all"
                >
                  Review
                </TabsTrigger>
                <TabsTrigger
                  value="original"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all"
                >
                  Original Code
                </TabsTrigger>
              </TabsList>
              <TabsContent value="review">
                <div className="relative">
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap">{review}</pre>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-0 top-0 bg-slate-800/80 hover:bg-slate-700 text-slate-200"
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
              <TabsContent value="original">
                <pre className="max-h-[500px] overflow-auto rounded-lg bg-slate-800/50 p-4 font-mono text-sm text-slate-200 border border-slate-700">
                  <code>{code}</code>
                </pre>
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
                onClick={downloadReview}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

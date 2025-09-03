"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, Zap, Check, Copy, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ModelSelector, models } from "@/components/model-selector"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ErrorHandler } from "@/lib/error-handler"

export function CodeOptimizer() {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [goals, setGoals] = useState<string[]>(["performance", "readability"])
  const [model, setModel] = useState(models[0].id)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizedCode, setOptimizedCode] = useState("")
  const [explanation, setExplanation] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code to optimize",
        variant: "destructive",
      })
      return
    }

    setIsOptimizing(true)
    setOptimizedCode("")
    setExplanation("")

    try {
      const response = await fetch("/api/optimize-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          goals,
          model,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to optimize code")
      }

      setOptimizedCode(data.optimizedCode)
      setExplanation(data.explanation)
      toast({
        title: "Code optimization completed",
        description: `Optimization generated using ${models.find((m) => m.id === data.model)?.name || data.model}`,
      })
    } catch (error) {
      console.error("Error optimizing code:", error)
      ErrorHandler.handleApiError(error)
    } finally {
      setIsOptimizing(false)
    }
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

      const extension =
        language === "typescript"
          ? "ts"
          : language === "python"
            ? "py"
            : language === "java"
              ? "java"
              : language === "csharp"
                ? "cs"
                : language === "go"
                  ? "go"
                  : language === "rust"
                    ? "rs"
                    : language === "php"
                      ? "php"
                      : language === "ruby"
                        ? "rb"
                        : language === "swift"
                          ? "swift"
                          : language === "kotlin"
                            ? "kt"
                            : "js"

      element.download = `optimized-code.${extension}`
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

  const toggleGoal = (goal: string) => {
    setGoals((prev) => {
      if (prev.includes(goal)) {
        return prev.filter((g) => g !== goal)
      } else {
        return [...prev, goal]
      }
    })
  }

  return (
    <div className="grid gap-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg">
        <CardHeader className="bg-black/20 backdrop-blur-sm">
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Code Optimizer
          </CardTitle>
          <CardDescription className="text-slate-300">
            Optimize your code for performance, readability, and modern best practices
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label htmlFor="model" className="block text-sm font-medium text-slate-300 mb-1">
                  AI Model
                </label>
                <ModelSelector value={model} onChange={setModel} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Optimization Goals</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="performance"
                    checked={goals.includes("performance")}
                    onCheckedChange={() => toggleGoal("performance")}
                  />
                  <label
                    htmlFor="performance"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300"
                  >
                    Performance
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="readability"
                    checked={goals.includes("readability")}
                    onCheckedChange={() => toggleGoal("readability")}
                  />
                  <label
                    htmlFor="readability"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300"
                  >
                    Readability
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="modernize"
                    checked={goals.includes("modernize")}
                    onCheckedChange={() => toggleGoal("modernize")}
                  />
                  <label
                    htmlFor="modernize"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300"
                  >
                    Modernize
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="security"
                    checked={goals.includes("security")}
                    onCheckedChange={() => toggleGoal("security")}
                  />
                  <label
                    htmlFor="security"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300"
                  >
                    Security
                  </label>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 shadow-[0_0_15px_rgba(56,189,248,0.5)] hover:shadow-[0_0_25px_rgba(56,189,248,0.7)]"
              disabled={isOptimizing}
            >
              {isOptimizing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Optimize Code
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {optimizedCode && (
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg">
          <CardHeader className="bg-black/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-200">Optimized Code</CardTitle>
                <CardDescription className="text-slate-300">Your code has been optimized</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                  {language}
                </Badge>
                {goals.map((goal) => (
                  <Badge key={goal} variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="optimized" className="w-full">
              <TabsList className="bg-slate-800/50 p-1 rounded-lg mb-4">
                <TabsTrigger
                  value="optimized"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all"
                >
                  Optimized Code
                </TabsTrigger>
                <TabsTrigger
                  value="original"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all"
                >
                  Original Code
                </TabsTrigger>
                <TabsTrigger
                  value="explanation"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all"
                >
                  Explanation
                </TabsTrigger>
              </TabsList>
              <TabsContent value="optimized">
                <div className="relative">
                  <pre className="max-h-[500px] overflow-auto rounded-lg bg-slate-800/50 p-4 font-mono text-sm text-slate-200 border border-slate-700">
                    <code>{optimizedCode}</code>
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
              <TabsContent value="original">
                <pre className="max-h-[500px] overflow-auto rounded-lg bg-slate-800/50 p-4 font-mono text-sm text-slate-200 border border-slate-700">
                  <code>{code}</code>
                </pre>
              </TabsContent>
              <TabsContent value="explanation">
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: explanation }} />
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
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

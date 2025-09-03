"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, Sparkles, Check, Copy, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ErrorHandler } from "@/lib/error-handler"

export function PromptGenerator() {
  const [topic, setTopic] = useState("")
  const [context, setContext] = useState("")
  const [tone, setTone] = useState("neutral")
  const [length, setLength] = useState("medium")
  const [format, setFormat] = useState("standard")
  const [additionalInstructions, setAdditionalInstructions] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic for your prompt",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setGeneratedPrompt("")
    setAnalysis("")

    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          context,
          tone,
          length,
          format,
          additionalInstructions,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate prompt")
      }

      setGeneratedPrompt(data.prompt)
      setAnalysis(data.analysis)
      toast({
        title: "Prompt generated successfully",
        description: "Your AI prompt has been generated",
      })
    } catch (error) {
      console.error("Error generating prompt:", error)
      ErrorHandler.handleApiError(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Copied to clipboard",
        description: "The prompt has been copied to your clipboard",
      })
    } catch (err) {
      console.error("Failed to copy text: ", err)
      toast({
        title: "Failed to copy",
        description: "Could not copy the prompt to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadPrompt = () => {
    try {
      const element = document.createElement("a")
      const file = new Blob([generatedPrompt], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = `prompt-${topic.replace(/\s+/g, "-").toLowerCase()}.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      toast({
        title: "Downloaded prompt",
        description: "The prompt has been downloaded as a text file",
      })
    } catch (err) {
      console.error("Failed to download prompt: ", err)
      toast({
        title: "Failed to download",
        description: "Could not download the prompt",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid gap-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg">
        <CardHeader className="bg-black/20 backdrop-blur-sm">
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Prompt Generator
          </CardTitle>
          <CardDescription className="text-slate-300">
            Create effective prompts for AI models to get better results
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-1">
                Topic
              </label>
              <Input
                id="topic"
                placeholder="What is your prompt about? E.g., 'Creating a marketing strategy for a new product'"
                className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="context" className="block text-sm font-medium text-slate-300 mb-1">
                Context (Optional)
              </label>
              <Textarea
                id="context"
                placeholder="Provide context for your prompt. E.g., 'This is for a B2B SaaS company targeting small businesses'"
                className="min-h-[100px] bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="tone" className="block text-sm font-medium text-slate-300 mb-1">
                  Tone
                </label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                    <SelectItem value="instructional">Instructional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="length" className="block text-sm font-medium text-slate-300 mb-1">
                  Length
                </label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                    <SelectItem value="short">Short (Concise)</SelectItem>
                    <SelectItem value="medium">Medium (Standard)</SelectItem>
                    <SelectItem value="long">Long (Detailed)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="format" className="block text-sm font-medium text-slate-300 mb-1">
                  Format
                </label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                    <SelectItem value="standard">Standard Prompt</SelectItem>
                    <SelectItem value="question">Question-Based</SelectItem>
                    <SelectItem value="roleplay">Role-Play</SelectItem>
                    <SelectItem value="step-by-step">Step-by-Step</SelectItem>
                    <SelectItem value="chain-of-thought">Chain of Thought</SelectItem>
                    <SelectItem value="few-shot">Few-Shot Learning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="additionalInstructions" className="block text-sm font-medium text-slate-300 mb-1">
                Additional Instructions (Optional)
              </label>
              <Textarea
                id="additionalInstructions"
                placeholder="Any specific requirements or constraints for the prompt..."
                className="min-h-[100px] bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
              />
            </div>

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
        </CardContent>
      </Card>

      {generatedPrompt && (
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg">
          <CardHeader className="bg-black/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-200">Generated Prompt</CardTitle>
                <CardDescription className="text-slate-300">Your AI prompt is ready to use</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                  {tone}
                </Badge>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                  {format}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="prompt" className="w-full">
              <TabsList className="bg-slate-800/50 p-1 rounded-lg mb-4">
                <TabsTrigger
                  value="prompt"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all"
                >
                  Prompt
                </TabsTrigger>
                <TabsTrigger
                  value="analysis"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all"
                >
                  Analysis
                </TabsTrigger>
              </TabsList>
              <TabsContent value="prompt">
                <div className="relative">
                  <div className="rounded-lg bg-slate-800/50 p-4 text-slate-200 border border-slate-700 whitespace-pre-wrap">
                    {generatedPrompt}
                  </div>
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
              <TabsContent value="analysis">
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: analysis }} />
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
                onClick={downloadPrompt}
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

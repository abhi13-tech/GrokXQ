"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, ClipboardList, Check, Copy, Download } from "lucide-react"
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

export function TestGenerator() {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [framework, setFramework] = useState("jest")
  const [testTypes, setTestTypes] = useState<string[]>(["unit", "edge"])
  const [coverage, setCoverage] = useState("medium")
  const [additionalContext, setAdditionalContext] = useState("")
  const [model, setModel] = useState(models[0].id)
  const [isGenerating, setIsGenerating] = useState(false)
  const [tests, setTests] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code to generate tests for",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setTests("")

    try {
      const response = await fetch("/api/generate-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          framework,
          testTypes,
          coverage,
          additionalContext,
          model,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate tests")
      }

      setTests(data.tests)
      toast({
        title: "Tests generated successfully",
        description: `Tests generated using ${models.find((m) => m.id === data.model)?.name || data.model}`,
      })
    } catch (error) {
      console.error("Error generating tests:", error)
      ErrorHandler.handleApiError(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(tests)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Copied to clipboard",
        description: "The tests have been copied to your clipboard",
      })
    } catch (err) {
      console.error("Failed to copy text: ", err)
      toast({
        title: "Failed to copy",
        description: "Could not copy the tests to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadTests = () => {
    try {
      const element = document.createElement("a")
      const file = new Blob([tests], { type: "text/plain" })
      element.href = URL.createObjectURL(file)

      const extension =
        language === "typescript"
          ? "test.ts"
          : language === "python"
            ? "test.py"
            : language === "java"
              ? "Test.java"
              : language === "csharp"
                ? "Tests.cs"
                : language === "go"
                  ? "_test.go"
                  : language === "rust"
                    ? "test.rs"
                    : language === "php"
                      ? "Test.php"
                      : language === "ruby"
                        ? "_test.rb"
                        : language === "swift"
                          ? "Tests.swift"
                          : language === "kotlin"
                            ? "Test.kt"
                            : "test.js"

      element.download = `generated-${extension}`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      toast({
        title: "Downloaded tests",
        description: "The tests have been downloaded",
      })
    } catch (err) {
      console.error("Failed to download tests: ", err)
      toast({
        title: "Failed to download",
        description: "Could not download the tests",
        variant: "destructive",
      })
    }
  }

  const toggleTestType = (type: string) => {
    setTestTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type)
      } else {
        return [...prev, type]
      }
    })
  }

  return (
    <div className="grid gap-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg">
        <CardHeader className="bg-black/20 backdrop-blur-sm">
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Test Generator
          </CardTitle>
          <CardDescription className="text-slate-300">
            Generate comprehensive tests for your code automatically
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
                <label htmlFor="framework" className="block text-sm font-medium text-slate-300 mb-1">
                  Testing Framework
                </label>
                <Select value={framework} onValueChange={setFramework}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                    {language === "javascript" || language === "typescript" ? (
                      <>
                        <SelectItem value="jest">Jest</SelectItem>
                        <SelectItem value="mocha">Mocha</SelectItem>
                        <SelectItem value="vitest">Vitest</SelectItem>
                      </>
                    ) : language === "python" ? (
                      <>
                        <SelectItem value="pytest">pytest</SelectItem>
                        <SelectItem value="unittest">unittest</SelectItem>
                      </>
                    ) : language === "java" ? (
                      <>
                        <SelectItem value="junit">JUnit</SelectItem>
                        <SelectItem value="testng">TestNG</SelectItem>
                      </>
                    ) : language === "csharp" ? (
                      <>
                        <SelectItem value="xunit">xUnit</SelectItem>
                        <SelectItem value="nunit">NUnit</SelectItem>
                        <SelectItem value="mstest">MSTest</SelectItem>
                      </>
                    ) : language === "go" ? (
                      <SelectItem value="go-test">Go Test</SelectItem>
                    ) : language === "rust" ? (
                      <SelectItem value="rust-test">Rust Test</SelectItem>
                    ) : language === "php" ? (
                      <SelectItem value="phpunit">PHPUnit</SelectItem>
                    ) : language === "ruby" ? (
                      <>
                        <SelectItem value="rspec">RSpec</SelectItem>
                        <SelectItem value="minitest">Minitest</SelectItem>
                      </>
                    ) : language === "swift" ? (
                      <SelectItem value="xctest">XCTest</SelectItem>
                    ) : language === "kotlin" ? (
                      <>
                        <SelectItem value="junit">JUnit</SelectItem>
                        <SelectItem value="kotlintest">KotlinTest</SelectItem>
                      </>
                    ) : (
                      <SelectItem value="default">Default</SelectItem>
                    )}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Test Types</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="unit"
                      checked={testTypes.includes("unit")}
                      onCheckedChange={() => toggleTestType("unit")}
                    />
                    <label
                      htmlFor="unit"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300"
                    >
                      Unit Tests
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="integration"
                      checked={testTypes.includes("integration")}
                      onCheckedChange={() => toggleTestType("integration")}
                    />
                    <label
                      htmlFor="integration"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300"
                    >
                      Integration Tests
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edge"
                      checked={testTypes.includes("edge")}
                      onCheckedChange={() => toggleTestType("edge")}
                    />
                    <label
                      htmlFor="edge"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300"
                    >
                      Edge Cases
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="performance"
                      checked={testTypes.includes("performance")}
                      onCheckedChange={() => toggleTestType("performance")}
                    />
                    <label
                      htmlFor="performance"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300"
                    >
                      Performance Tests
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="coverage" className="block text-sm font-medium text-slate-300 mb-1">
                  Coverage Level
                </label>
                <Select value={coverage} onValueChange={setCoverage}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                    <SelectValue placeholder="Select coverage level" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                    <SelectItem value="low">Low (Basic Tests)</SelectItem>
                    <SelectItem value="medium">Medium (Standard Coverage)</SelectItem>
                    <SelectItem value="high">High (Comprehensive Coverage)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="additionalContext" className="block text-sm font-medium text-slate-300 mb-1">
                Additional Context (Optional)
              </label>
              <Textarea
                id="additionalContext"
                placeholder="Add any specific requirements, constraints, or additional information about your code..."
                className="min-h-[100px] bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
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
                  Generating Tests...
                </>
              ) : (
                <>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Generate Tests
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {tests && (
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg">
          <CardHeader className="bg-black/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-200">Generated Tests</CardTitle>
                <CardDescription className="text-slate-300">
                  Tests for your code using {framework} framework
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                  {language}
                </Badge>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                  {framework}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="tests" className="w-full">
              <TabsList className="bg-slate-800/50 p-1 rounded-lg mb-4">
                <TabsTrigger
                  value="tests"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all"
                >
                  Generated Tests
                </TabsTrigger>
                <TabsTrigger
                  value="original"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all"
                >
                  Original Code
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tests">
                <div className="relative">
                  <pre className="max-h-[500px] overflow-auto rounded-lg bg-slate-800/50 p-4 font-mono text-sm text-slate-200 border border-slate-700">
                    <code>{tests}</code>
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
                onClick={downloadTests}
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

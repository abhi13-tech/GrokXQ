"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Copy, Check, Download, Play, Beaker, FileCode } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModelSelector } from "@/components/model-selector"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  language: z.string(),
  framework: z.string(),
  testTypes: z.array(z.string()).min(1, "Select at least one test type"),
  coverage: z.string(),
  model: z.string(),
  additionalContext: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const TEST_TYPES = [
  { id: "unit", label: "Unit Tests" },
  { id: "integration", label: "Integration Tests" },
  { id: "e2e", label: "End-to-End Tests" },
  { id: "performance", label: "Performance Tests" },
]

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
]

const FRAMEWORKS = [
  { value: "jest", label: "Jest" },
  { value: "mocha", label: "Mocha" },
  { value: "pytest", label: "PyTest" },
  { value: "junit", label: "JUnit" },
  { value: "xunit", label: "xUnit" },
  { value: "cypress", label: "Cypress" },
  { value: "playwright", label: "Playwright" },
  { value: "none", label: "None" },
]

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

export function TestGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTests, setGeneratedTests] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const testsRef = useRef<HTMLPreElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      language: "javascript",
      framework: "jest",
      testTypes: ["unit"],
      coverage: "medium",
      model: "groq-llama-3.1-8b-instant",
      additionalContext: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate tests: ${response.statusText}`)
      }

      const result = await response.json()
      setGeneratedTests(result.tests)

      toast({
        title: "Tests generated successfully",
        description: "Your tests have been generated.",
      })
    } catch (error) {
      console.error("Error generating tests:", error)
      toast({
        title: "Error generating tests",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedTests)
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
      const file = new Blob([generatedTests], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = `tests.${form.getValues("language") === "typescript" ? "ts" : form.getValues("language")}`
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

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="bg-black/20 backdrop-blur-sm">
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Test Generator
            </CardTitle>
            <CardDescription className="text-slate-300">Generate comprehensive tests for your code</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    name="framework"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Testing Framework</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                              <SelectValue placeholder="Select framework" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                            {FRAMEWORKS.map((framework) => (
                              <SelectItem key={framework.value} value={framework.value}>
                                {framework.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-slate-400">Select the testing framework</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coverage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Test Coverage</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                              <SelectValue placeholder="Select coverage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                            <SelectItem value="low">Basic (70%)</SelectItem>
                            <SelectItem value="medium">Standard (85%)</SelectItem>
                            <SelectItem value="high">Comprehensive (95%+)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-slate-400">Desired test coverage level</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="testTypes"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Test Types</FormLabel>
                      <FormDescription className="text-slate-400">
                        Select the types of tests to generate
                      </FormDescription>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {TEST_TYPES.map((type) => (
                          <FormField
                            key={type.id}
                            control={form.control}
                            name="testTypes"
                            render={({ field }) => {
                              return (
                                <FormItem key={type.id} className="flex flex-row items-start space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(type.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, type.id])
                                          : field.onChange(field.value?.filter((value) => value !== type.id))
                                      }}
                                      className="border-slate-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal cursor-pointer text-slate-300">
                                    {type.label}
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
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-slate-400">Paste the code you want to test</FormDescription>
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
                        <textarea
                          className="w-full min-h-[100px] p-4 resize-none focus:outline-none bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all rounded-md"
                          placeholder="Add any specific requirements, edge cases, or additional information"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-slate-400">
                        Provide any additional details to make the tests more specific
                      </FormDescription>
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
                      <FormDescription className="text-slate-400">
                        Select the AI model to generate your tests
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
                      Generating Tests...
                    </>
                  ) : (
                    <>
                      <Beaker className="mr-2 h-4 w-4" />
                      Generate Tests
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {generatedTests && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg dark:from-slate-950 dark:to-slate-900">
              <CardHeader className="bg-black/20 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-200">Generated Tests</CardTitle>
                    <CardDescription className="text-slate-300">
                      Review and copy the generated test code
                    </CardDescription>
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
                      Documentation
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="code">
                    <div className="relative">
                      <div className="absolute top-2 right-2 bg-slate-800 rounded px-2 py-1 text-xs text-slate-400 font-mono">
                        {generatedTests ? generatedTests.split("\n").length : 0} lines
                      </div>
                      <pre
                        ref={testsRef}
                        className="max-h-[500px] overflow-auto rounded-lg bg-slate-800/50 p-4 font-mono text-sm text-slate-200 border border-slate-700"
                      >
                        {generatedTests}
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
                    <div className="rounded-lg border border-slate-700 p-6 bg-slate-800/30">
                      <h3 className="text-lg font-semibold mb-4 text-slate-200">Test Coverage</h3>
                      <p className="mb-4 text-slate-300">The generated tests cover the following scenarios:</p>
                      <ul className="list-disc pl-5 space-y-2 mb-6 text-slate-300">
                        <li>Initial loading state</li>
                        <li>Successful data fetching and rendering</li>
                        <li>Error handling</li>
                        <li>Empty data handling</li>
                        {form.watch("testTypes").includes("performance") && <li>Performance benchmarks</li>}
                        {form.watch("testTypes").includes("e2e") && <li>End-to-end user flows</li>}
                      </ul>
                      <h3 className="text-lg font-semibold mb-4 text-slate-200">Usage Instructions</h3>
                      <p className="text-slate-300">
                        Place these tests in a file adjacent to your component code. Run them using your testing
                        framework's CLI or integration with your IDE.
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
                  Save Tests
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
                  <Button
                    variant="outline"
                    className="bg-blue-600/20 border-blue-500/50 text-blue-400 hover:bg-blue-600/30 hover:text-blue-300 transition-all"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Run Tests
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

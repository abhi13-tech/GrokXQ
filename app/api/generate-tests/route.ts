import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { z } from "zod"
import { PerformanceMonitor } from "@/lib/performance-monitor"

// Input validation schema
const generateTestsRequestSchema = z.object({
  code: z.string().min(10),
  language: z.string().min(1),
  testFramework: z.string().min(1),
  coverageLevel: z.enum(["basic", "moderate", "comprehensive"]).default("moderate"),
})

export async function POST(req: NextRequest) {
  // Start performance monitoring
  PerformanceMonitor.startMeasure("generate-tests-api")

  try {
    // Parse and validate request body
    const body = await req.json()

    const validationResult = generateTestsRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    const { code, language, testFramework, coverageLevel } = validationResult.data

    // Create test generation prompt based on parameters
    let testPrompt = `Generate ${coverageLevel} test cases for the following ${language} code using the ${testFramework} testing framework.`

    switch (coverageLevel) {
      case "basic":
        testPrompt += " Focus on testing the main functionality with simple inputs and outputs."
        break
      case "moderate":
        testPrompt += " Include tests for edge cases and error handling in addition to main functionality."
        break
      case "comprehensive":
        testPrompt +=
          " Create an extensive test suite covering all functionality, edge cases, error handling, and performance considerations."
        break
    }

    testPrompt += `\n\nCode to test:\n\`\`\`${language}\n${code}\n\`\`\`\n\nPlease provide well-structured tests with clear descriptions and assertions.`

    // Generate tests
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: testPrompt,
      temperature: 0.3,
      maxTokens: 4000,
    })

    // Extract test code from response if needed
    let testCode = text

    // If the response contains markdown code blocks, extract just the code
    const codeBlockRegex = new RegExp(`\`\`\`(?:${language}|${testFramework})?\n(.*?)\n\`\`\``, "s")
    const match = text.match(codeBlockRegex)

    if (match && match[1]) {
      testCode = match[1]
    }

    // Return the generated tests
    return NextResponse.json({
      result: text,
      testCode,
      codeLength: code.length,
      language,
      testFramework,
      coverageLevel,
    })
  } catch (error) {
    console.error("Error generating tests:", error)

    // Handle different types of errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: "AI model error", message: error.message }, { status: 500 })
    }

    // Generic error
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  } finally {
    // End performance monitoring
    const duration = PerformanceMonitor.endMeasure("generate-tests-api")
    console.log(`Generate tests API took ${duration?.toFixed(2)}ms`)
  }
}

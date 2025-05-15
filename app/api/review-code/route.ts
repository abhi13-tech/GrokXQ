import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { z } from "zod"
import { PerformanceMonitor } from "@/lib/performance-monitor"

// Input validation schema
const reviewCodeRequestSchema = z.object({
  code: z.string().min(10),
  language: z.string().min(1),
  reviewDepth: z.enum(["basic", "detailed", "comprehensive"]).default("detailed"),
  includeExamples: z.boolean().optional().default(true),
})

export async function POST(req: NextRequest) {
  // Start performance monitoring
  PerformanceMonitor.startMeasure("review-code-api")

  try {
    // Parse and validate request body
    const body = await req.json()

    const validationResult = reviewCodeRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    const { code, language, reviewDepth, includeExamples } = validationResult.data

    // Create review prompt based on parameters
    let reviewPrompt = `Review the following ${language} code and provide `

    switch (reviewDepth) {
      case "basic":
        reviewPrompt += "a basic review focusing on obvious issues and quick improvements."
        break
      case "detailed":
        reviewPrompt += "a detailed review covering code quality, performance, and potential bugs."
        break
      case "comprehensive":
        reviewPrompt +=
          "a comprehensive review analyzing code quality, performance, security, maintainability, and best practices."
        break
    }

    if (includeExamples) {
      reviewPrompt += " Include specific examples of how to improve the code."
    }

    reviewPrompt += `\n\nCode to review:\n\`\`\`${language}\n${code}\n\`\`\`\n\nPlease structure your review with the following sections:\n1. Summary\n2. Strengths\n3. Areas for Improvement\n4. Specific Recommendations`

    // Generate code review
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: reviewPrompt,
      temperature: 0.3,
      maxTokens: 4000,
    })

    // Return the code review
    return NextResponse.json({
      result: text,
      codeLength: code.length,
      language,
      reviewDepth,
    })
  } catch (error) {
    console.error("Error reviewing code:", error)

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
    const duration = PerformanceMonitor.endMeasure("review-code-api")
    console.log(`Review code API took ${duration?.toFixed(2)}ms`)
  }
}

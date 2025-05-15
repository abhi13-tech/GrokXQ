import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { z } from "zod"
import { PerformanceMonitor } from "@/lib/performance-monitor"

// Input validation schema
const promptRequestSchema = z.object({
  prompt: z.string().min(3).max(1000),
  model: z.string().min(1),
  temperature: z.number().min(0).max(1).optional().default(0.7),
  maxTokens: z.number().int().positive().max(4000).optional().default(1000),
})

export async function POST(req: NextRequest) {
  // Start performance monitoring
  PerformanceMonitor.startMeasure("generate-prompt-api")

  try {
    // Parse and validate request body
    const body = await req.json()

    const validationResult = promptRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    const { prompt, model, temperature, maxTokens } = validationResult.data

    // Select the appropriate model
    const modelToUse = model === "groq-llama3-70b" ? groq("llama3-70b-8192") : groq("mixtral-8x7b-32768")

    // Generate the prompt
    const { text } = await generateText({
      model: modelToUse,
      prompt,
      temperature,
      maxTokens,
    })

    // Return the generated prompt
    return NextResponse.json({ result: text })
  } catch (error) {
    console.error("Error generating prompt:", error)

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
    const duration = PerformanceMonitor.endMeasure("generate-prompt-api")
    console.log(`Generate prompt API took ${duration?.toFixed(2)}ms`)
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { z } from "zod"
import { PerformanceMonitor } from "@/lib/performance-monitor"

// Input validation schema
const optimizeCodeRequestSchema = z.object({
  code: z.string().min(10),
  language: z.string().min(1),
  optimizationLevel: z.enum(["basic", "advanced", "expert"]).default("advanced"),
  preserveComments: z.boolean().optional().default(true),
})

export async function POST(req: NextRequest) {
  // Start performance monitoring
  PerformanceMonitor.startMeasure("optimize-code-api")

  try {
    // Parse and validate request body
    const body = await req.json()

    const validationResult = optimizeCodeRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    const { code, language, optimizationLevel, preserveComments } = validationResult.data

    // Create optimization prompt based on parameters
    let optimizationPrompt = `Optimize the following ${language} code for `

    switch (optimizationLevel) {
      case "basic":
        optimizationPrompt += "basic performance improvements while maintaining readability."
        break
      case "advanced":
        optimizationPrompt += "significant performance improvements with a balance of readability and efficiency."
        break
      case "expert":
        optimizationPrompt += "maximum performance, prioritizing efficiency over readability where necessary."
        break
    }

    if (preserveComments) {
      optimizationPrompt += " Preserve all comments in the original code."
    }

    optimizationPrompt += `\n\nOriginal code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nOptimized code:`

    // Generate optimized code
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: optimizationPrompt,
      temperature: 0.2, // Lower temperature for more deterministic results
      maxTokens: 4000,
    })

    // Extract code from response if needed
    let optimizedCode = text

    // If the response contains markdown code blocks, extract just the code
    const codeBlockRegex = new RegExp(`\`\`\`(?:${language})?\n(.*?)\n\`\`\``, "s")
    const match = text.match(codeBlockRegex)

    if (match && match[1]) {
      optimizedCode = match[1]
    }

    // Return the optimized code
    return NextResponse.json({
      result: optimizedCode,
      originalLength: code.length,
      optimizedLength: optimizedCode.length,
      improvementPercentage: (((code.length - optimizedCode.length) / code.length) * 100).toFixed(2),
    })
  } catch (error) {
    console.error("Error optimizing code:", error)

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
    const duration = PerformanceMonitor.endMeasure("optimize-code-api")
    console.log(`Optimize code API took ${duration?.toFixed(2)}ms`)
  }
}

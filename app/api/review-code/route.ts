import { NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { ErrorHandler } from "@/lib/error-handler"

export async function POST(req: Request) {
  try {
    const { code, language, reviewType, model } = await req.json()

    // Validate inputs
    if (!code || !language) {
      return NextResponse.json({ error: "Missing required fields: code and language" }, { status: 400 })
    }

    // Create a system message that instructs the model how to review code
    const systemMessage = `You are an expert code reviewer specializing in ${language} development.
    
    Your task is to:
    1. Review the provided code and identify issues, bugs, and areas for improvement
    2. Provide specific, actionable feedback
    3. Suggest improvements with code examples where appropriate
    4. Focus on ${
      reviewType === "security"
        ? "security vulnerabilities and best practices"
        : reviewType === "performance"
          ? "performance optimizations and efficiency"
          : reviewType === "readability"
            ? "code readability, maintainability, and documentation"
            : "overall code quality, including bugs, edge cases, and best practices"
    }
    
    Format your response as markdown with the following sections:
    - Summary (brief overview of the code and main findings)
    - Key Issues (list the most important issues to address)
    - Detailed Analysis (in-depth review with code examples)
    - Recommendations (specific suggestions for improvement)
    
    Be thorough but constructive in your feedback.`

    // Generate the code review using Groq
    const { text } = await generateText({
      model: groq(model || "llama3-8b-8192"),
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: `Please review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        },
      ],
      temperature: 0.2,
      maxTokens: 3000,
    })

    return NextResponse.json({
      review: text,
      model: model || "llama3-8b-8192",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error reviewing code:", error)
    ErrorHandler.logError(error, { service: "code-review-api" })

    return NextResponse.json(
      {
        error: "Failed to review code",
        details: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

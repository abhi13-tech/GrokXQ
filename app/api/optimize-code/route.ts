import { NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { ErrorHandler } from "@/lib/error-handler"

export async function POST(req: Request) {
  try {
    const { code, language, goals, model } = await req.json()

    // Validate inputs
    if (!code || !language) {
      return NextResponse.json({ error: "Missing required fields: code and language" }, { status: 400 })
    }

    // Create a system message that instructs the model how to optimize code
    const systemMessage = `You are an expert code optimizer specializing in ${language} development.
    
    Your task is to optimize the provided code with a focus on:
    ${goals?.includes("performance") ? "- Performance: Make the code run faster and more efficiently\n" : ""}
    ${goals?.includes("readability") ? "- Readability: Improve code clarity and maintainability\n" : ""}
    ${goals?.includes("modernize") ? "- Modernization: Update to modern language features and best practices\n" : ""}
    ${goals?.includes("security") ? "- Security: Fix security vulnerabilities and follow security best practices\n" : ""}
    ${
      !goals || goals.length === 0
        ? "- General optimization: Improve the code's overall quality, performance, and readability\n"
        : ""
    }
    
    Provide your response in the following format:
    1. First, the optimized code without any explanations or markdown
    2. Then, after the code, include "# Optimization Explanation" followed by a detailed explanation of:
       - What changes you made and why
       - How the changes improve the code
       - Any trade-offs or considerations
    
    The optimized code should be fully functional and maintain the original code's behavior unless there are bugs to fix.`

    // Generate the optimized code using Groq
    const { text } = await generateText({
      model: groq(model || "llama3-8b-8192"),
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: `Please optimize this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        },
      ],
      temperature: 0.2,
      maxTokens: 3000,
    })

    // Split the response into code and explanation
    const parts = text.split("# Optimization Explanation")
    const optimizedCode = parts[0].trim()
    const explanation = parts.length > 1 ? parts[1].trim() : "No explanation provided."

    return NextResponse.json({
      optimizedCode,
      explanation,
      model: model || "llama3-8b-8192",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error optimizing code:", error)
    ErrorHandler.logError(error, { service: "code-optimization-api" })

    return NextResponse.json(
      {
        error: "Failed to optimize code",
        details: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

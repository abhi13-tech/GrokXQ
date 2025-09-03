import { NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { ErrorHandler } from "@/lib/error-handler"

export async function POST(req: Request) {
  try {
    const { code, language, framework, testTypes, coverage, additionalContext, model } = await req.json()

    // Validate inputs
    if (!code || !language) {
      return NextResponse.json({ error: "Missing required fields: code and language" }, { status: 400 })
    }

    // Create a system message that instructs the model how to generate tests
    const systemMessage = `You are an expert test engineer specializing in ${language} development.
    
    Your task is to generate comprehensive tests for the provided code using ${framework || "the appropriate testing framework"}.
    
    Focus on the following test types:
    ${testTypes?.includes("unit") ? "- Unit tests: Test individual functions and methods\n" : ""}
    ${testTypes?.includes("integration") ? "- Integration tests: Test interactions between components\n" : ""}
    ${testTypes?.includes("edge") ? "- Edge case tests: Test boundary conditions and error handling\n" : ""}
    ${testTypes?.includes("performance") ? "- Performance tests: Test code efficiency and timing\n" : ""}
    ${
      !testTypes || testTypes.length === 0
        ? "- Comprehensive tests: Include unit tests, integration tests, and edge case tests\n"
        : ""
    }
    
    Coverage level: ${coverage || "standard"} (${
      coverage === "high"
        ? "aim for >90% code coverage"
        : coverage === "medium"
          ? "aim for >70% code coverage"
          : "aim for >50% code coverage"
    })
    
    Additional context: ${additionalContext || "None provided"}
    
    Generate only the test code without explanations or markdown formatting. The tests should be ready to run with minimal modifications.`

    // Generate the tests using Groq
    const { text } = await generateText({
      model: groq(model || "llama3-8b-8192"),
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: `Please generate tests for this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        },
      ],
      temperature: 0.2,
      maxTokens: 3000,
    })

    return NextResponse.json({
      tests: text,
      model: model || "llama3-8b-8192",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error generating tests:", error)
    ErrorHandler.logError(error, { service: "test-generation-api" })

    return NextResponse.json(
      {
        error: "Failed to generate tests",
        details: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

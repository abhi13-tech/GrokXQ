import { NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { ErrorHandler } from "@/lib/error-handler"

export async function POST(req: Request) {
  try {
    const { projectDescription, technologies, features, developmentStage, model } = await req.json()

    // Validate inputs
    if (!projectDescription) {
      return NextResponse.json({ error: "Missing required field: projectDescription" }, { status: 400 })
    }

    // Create a system message that instructs the model how to generate a development plan
    const systemMessage = `You are an expert software architect and development manager.
    
    Your task is to create a comprehensive development plan based on the following specifications:
    - Project Description: ${projectDescription}
    - Technologies: ${technologies?.join(", ") || "Not specified"}
    - Features: ${features?.join(", ") || "Not specified"}
    - Development Stage: ${developmentStage || "Initial planning"}
    
    The development plan should include:
    1. Project Architecture Overview
    2. Component Breakdown
    3. Development Phases
    4. Task Prioritization
    5. Timeline Estimates
    6. Potential Challenges and Mitigations
    
    Format your response as markdown with clear sections and subsections.`

    // Generate the development plan using Groq
    const { text } = await generateText({
      model: groq(model || "llama3-8b-8192"),
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: `Please create a development plan for: ${projectDescription}`,
        },
      ],
      temperature: 0.3,
      maxTokens: 3000,
    })

    return NextResponse.json({
      plan: text,
      model: model || "llama3-8b-8192",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error generating development plan:", error)
    ErrorHandler.logError(error, { service: "development-workflow-api" })

    return NextResponse.json(
      {
        error: "Failed to generate development plan",
        details: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

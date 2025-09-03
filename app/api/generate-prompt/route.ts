import { NextResponse } from "next/server"
import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"
import { ErrorHandler } from "@/lib/error-handler"

export async function POST(req: Request) {
  try {
    const { topic, context, tone, length, format, additionalInstructions } = await req.json()

    // Validate inputs
    if (!topic) {
      return NextResponse.json({ error: "Missing required field: topic" }, { status: 400 })
    }

    // Create a system message that instructs the model how to generate a prompt
    const systemMessage = `You are an expert prompt engineer specializing in creating effective prompts for AI models.
    
    Your task is to create a high-quality prompt based on the following specifications:
    - Topic: ${topic}
    - Context: ${context || "General use"}
    - Tone: ${tone || "Neutral"}
    - Length: ${length || "Medium"}
    - Format: ${format || "Standard prompt"}
    - Additional Instructions: ${additionalInstructions || "None provided"}
    
    The prompt should be clear, specific, and designed to elicit the best possible response from an AI model.
    
    Format your response as follows:
    1. First, provide the prompt itself without any explanations or markdown
    2. Then, after the prompt, include "# Prompt Analysis" followed by a brief explanation of:
       - Why this prompt is effective
       - How to use it effectively
       - Potential variations for different use cases`

    // Generate the prompt using XAI (Grok)
    const { text } = await generateText({
      model: xai("grok-1"),
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: `Please create a prompt about: ${topic}`,
        },
      ],
      temperature: 0.7,
      maxTokens: 2000,
    })

    // Split the response into prompt and analysis
    const parts = text.split("# Prompt Analysis")
    const generatedPrompt = parts[0].trim()
    const analysis = parts.length > 1 ? parts[1].trim() : "No analysis provided."

    return NextResponse.json({
      prompt: generatedPrompt,
      analysis,
      model: "grok-1",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error generating prompt:", error)
    ErrorHandler.logError(error, { service: "prompt-generation-api" })

    return NextResponse.json(
      {
        error: "Failed to generate prompt",
        details: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

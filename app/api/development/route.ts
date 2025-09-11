import { groq } from "@ai-sdk/groq"
import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { projectId, codebase, developmentStage, model } = await req.json()

    // Create a system message that instructs the model how to provide development insights
    const systemMessage = `You are an expert software engineer specializing in development workflow optimization.
    You are analyzing a project with ID: ${projectId}.
    The current development stage is: ${developmentStage}.
    
    Your task is to:
    1. Analyze the provided codebase information
    2. Identify areas for improvement in the development process
    3. Provide actionable recommendations for optimizing the workflow
    4. Suggest next steps for the development team
    
    Format your response as JSON with the following structure:
    {
      "insights": [
        {
          "category": "string", // e.g., "Code Quality", "Performance", "Testing", etc.
          "findings": ["string"], // List of specific findings
          "recommendations": ["string"] // List of actionable recommendations
        }
      ],
      "nextSteps": ["string"], // List of suggested next steps
      "metrics": {
        "codeQualityScore": number, // 0-100
        "testCoverage": number, // 0-100
        "performanceScore": number // 0-100
      }
    }`

    // Determine which model to use based on the model parameter
    let aiModel
    if (model.startsWith("groq")) {
      const modelName = model.replace("groq-", "")
      aiModel = groq(modelName)
    } else if (model.startsWith("xai")) {
      const modelName = model.replace("xai-", "")
      aiModel = xai(modelName)
    } else {
      // Default to Groq's Llama model
      aiModel = groq("llama-3.1-8b-instant")
    }

    // Generate the development insights using the selected model
    const result = await generateText({
      model: aiModel,
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: `Please analyze this project and provide development insights:\n\n${JSON.stringify(codebase, null, 2)}`,
        },
      ],
      temperature: 0.3,
      maxTokens: 2000,
    })

    // Parse the response as JSON
    try {
      const insights = JSON.parse(result.text)
      return Response.json(insights)
    } catch (parseError) {
      console.error("Error parsing model response as JSON:", parseError)
      return Response.json({ error: "Failed to parse development insights" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error generating development insights:", error)
    return Response.json({ error: "Failed to generate development insights" }, { status: 500 })
  }
}

import { groq } from "@ai-sdk/groq"
import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { description, language, framework, model, additionalContext } = await req.json()

    // Create a system message that instructs the model how to generate code
    const systemMessage = `You are an expert software engineer specializing in ${language} development.
    You are using the ${framework} framework.
    
    Your task is to:
    1. Generate high-quality, production-ready code based on the user's description
    2. Follow best practices for ${language} and ${framework}
    3. Include appropriate error handling, comments, and type definitions (if applicable)
    4. Ensure the code is efficient, readable, and maintainable
    
    Additional context from the user: ${additionalContext || "None provided"}
    
    Return only the code without any explanations or markdown formatting.`

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

    // Generate the code using the selected model
    const result = await generateText({
      model: aiModel,
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: `Please generate ${language} code using ${framework} for: ${description}`,
        },
      ],
      temperature: 0.3,
      maxTokens: 3000,
    })

    return Response.json({ code: result.text })
  } catch (error) {
    console.error("Error generating code:", error)
    return Response.json({ error: "Failed to generate code" }, { status: 500 })
  }
}

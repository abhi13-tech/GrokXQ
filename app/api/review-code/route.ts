import { groq } from "@ai-sdk/groq"
import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { code, language, reviewType, model } = await req.json()

    // Create a system message that instructs the model how to review code
    const systemMessage = `You are an expert software engineer specializing in code review. 
    You are reviewing code written in ${language}.
    
    Focus on ${reviewType === "general" ? "all aspects" : reviewType} of the code.
    
    Provide a comprehensive review that includes:
    1. A summary of the code's purpose (if discernible)
    2. Strengths of the code
    3. Areas for improvement
    4. Specific recommendations with code examples where appropriate
    
    Format your response in Markdown with appropriate headings and code blocks.
    Be constructive, specific, and actionable in your feedback.`

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

    // Generate the code review using the selected model
    const result = await generateText({
      model: aiModel,
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
      temperature: 0.3,
      maxTokens: 2000,
    })

    return Response.json({ review: result.text })
  } catch (error) {
    console.error("Error reviewing code:", error)
    return Response.json({ error: "Failed to review code" }, { status: 500 })
  }
}

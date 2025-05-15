import { groq } from "@ai-sdk/groq"
import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { code, language, goals, model } = await req.json()

    // Create a system message that instructs the model how to optimize code
    const systemMessage = `You are an expert software engineer specializing in code optimization.
    You are optimizing code written in ${language}.
    
    Focus on the following optimization goals: ${goals.join(", ")}.
    
    Your task is to:
    1. Analyze the provided code
    2. Optimize it according to the specified goals
    3. Provide the optimized code
    4. Explain the changes you made and why they improve the code
    
    Return your response in the following format:
    
    OPTIMIZED_CODE:
    \`\`\`${language}
    [Your optimized code here]
    \`\`\`
    
    EXPLANATION:
    [Your detailed explanation of the changes and improvements]`

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

    // Generate the optimized code using the selected model
    const result = await generateText({
      model: aiModel,
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
      temperature: 0.3,
      maxTokens: 3000,
    })

    // Parse the response to extract the optimized code and explanation
    const response = result.text
    const optimizedCodeMatch = response.match(/OPTIMIZED_CODE:\s*```(?:\w+)?\s*([\s\S]*?)```/i)
    const explanationMatch = response.match(/EXPLANATION:\s*([\s\S]*?)(?:$|OPTIMIZED_CODE)/i)

    const optimizedCode = optimizedCodeMatch ? optimizedCodeMatch[1].trim() : ""
    const explanation = explanationMatch ? explanationMatch[1].trim() : ""

    return Response.json({ optimizedCode, explanation })
  } catch (error) {
    console.error("Error optimizing code:", error)
    return Response.json({ error: "Failed to optimize code" }, { status: 500 })
  }
}

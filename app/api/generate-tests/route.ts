import { groq } from "@ai-sdk/groq"
import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { code, language, framework, testTypes, coverage, model, additionalContext } = await req.json()

    // Create a system message that instructs the model how to generate tests
    const systemMessage = `You are an expert software engineer specializing in test generation. 
    You are generating tests for code written in ${language} using the ${framework} testing framework.
    
    Focus on the following test types: ${testTypes.join(", ")}.
    The desired test coverage level is: ${coverage} (where low is ~70%, medium is ~85%, and high is 95%+).
    
    Additional context: ${additionalContext || "None provided"}
    
    Your task is to:
    1. Analyze the provided code
    2. Generate comprehensive tests that cover the specified test types
    3. Ensure the tests follow best practices for the specified framework
    4. Include comments explaining the purpose of each test
    
    Format your response as valid ${language} code with appropriate test syntax for ${framework}.`

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

    // Generate the tests using the selected model
    const result = await generateText({
      model: aiModel,
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: `Please generate ${framework} tests for this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        },
      ],
      temperature: 0.3,
      maxTokens: 3000,
    })

    return Response.json({ tests: result.text })
  } catch (error) {
    console.error("Error generating tests:", error)
    return Response.json({ error: "Failed to generate tests" }, { status: 500 })
  }
}

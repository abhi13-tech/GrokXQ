import { groq } from "@ai-sdk/groq"
import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"
import { createServerClient } from "@/lib/supabase"
import { logActivity } from "@/lib/activity-logger"

export async function POST(req: Request) {
  try {
    const { topic, promptType, tone, length, additionalContext, model, userId, projectId } = await req.json()

    // Create a system message that instructs the model how to generate prompts
    const systemMessage = `You are an expert prompt engineer who creates high-quality, effective prompts for AI models. 
    Your task is to generate a prompt based on the following parameters:
    - Topic: ${topic}
    - Type: ${promptType} prompt
    - Tone: ${tone}
    - Length: ${length}% (where 100% is a comprehensive prompt and 10% is very concise)
    - Additional Context: ${additionalContext || "None provided"}
    
    Create a well-structured, clear prompt that will produce excellent results when used with AI models. 
    The prompt should be directly usable - do not include explanations, introductions, or meta-commentary.
    Just provide the prompt itself.`

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

    // Generate the prompt using the selected model
    const result = await generateText({
      model: aiModel,
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: `Please create a ${promptType} prompt about ${topic} with a ${tone} tone.`,
        },
      ],
      temperature: 0.7,
      maxTokens: 1000,
    })

    // If userId is provided, save the prompt to the database
    if (userId) {
      const supabase = createServerClient()

      const { error } = await supabase.from("prompts").insert({
        topic,
        prompt_type: promptType,
        tone,
        length,
        additional_context: additionalContext || null,
        model,
        generated_prompt: result.text,
        user_id: userId,
        project_id: projectId || null,
      })

      if (error) {
        console.error("Error saving prompt to database:", error)
      } else {
        // Log the activity
        await logActivity(userId, "prompt_generation", `Generated a ${promptType} prompt about ${topic}`, projectId, {
          topic,
          promptType,
          tone,
          length,
          model,
        })
      }
    }

    return Response.json({ prompt: result.text })
  } catch (error) {
    console.error("Error generating prompt:", error)
    return Response.json({ error: "Failed to generate prompt" }, { status: 500 })
  }
}

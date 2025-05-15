import * as z from "zod"

// Prompt Generator Validation Schema
export const promptGenerationSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters").max(1000, "Topic must be less than 1000 characters"),
  promptType: z.enum(["writing", "coding", "brainstorming", "analysis", "creative"]),
  tone: z.enum(["professional", "casual", "academic", "enthusiastic", "technical"]),
  length: z.number().min(10).max(100),
  additionalContext: z.string().optional(),
  model: z.string().min(1, "Please select a model"),
  projectId: z.string().optional(),
})

// Code Optimizer Validation Schema
export const codeOptimizationSchema = z.object({
  code: z.string().min(10, "Code must be at least 10 characters"),
  language: z.string().min(1, "Please select a language"),
  model: z.string().min(1, "Please select a model"),
  goals: z
    .array(z.enum(["performance", "readability", "security", "maintainability", "modernize"]))
    .min(1, "Select at least one optimization goal"),
})

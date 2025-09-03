/**
 * Validates if the required API keys are available
 */
export function validateApiKeys() {
  const missingKeys = []

  if (!process.env.GROQ_API_KEY) {
    missingKeys.push("GROQ_API_KEY")
  }

  if (!process.env.XAI_API_KEY) {
    missingKeys.push("XAI_API_KEY")
  }

  return {
    isValid: missingKeys.length === 0,
    missingKeys,
  }
}

/**
 * Validates if a specific API key is available
 */
export function validateApiKey(keyName: "GROQ_API_KEY" | "XAI_API_KEY") {
  const key = process.env[keyName]
  return {
    isValid: !!key,
    keyName,
  }
}

/**
 * Gets the appropriate model based on availability
 */
export function getAvailableModel(preferredProvider: "groq" | "xai" = "groq") {
  const groqAvailable = !!process.env.GROQ_API_KEY
  const xaiAvailable = !!process.env.XAI_API_KEY

  if (preferredProvider === "groq" && groqAvailable) {
    return {
      provider: "groq",
      modelId: "llama3-8b-8192",
    }
  } else if (preferredProvider === "xai" && xaiAvailable) {
    return {
      provider: "xai",
      modelId: "grok-1",
    }
  } else if (groqAvailable) {
    return {
      provider: "groq",
      modelId: "llama3-8b-8192",
    }
  } else if (xaiAvailable) {
    return {
      provider: "xai",
      modelId: "grok-1",
    }
  } else {
    throw new Error("No API keys available for AI providers")
  }
}

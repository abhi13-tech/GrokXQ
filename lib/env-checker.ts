/**
 * Utility to check if required environment variables are set
 */
export const checkRequiredEnvVars = () => {
  const requiredVars = [
    // Supabase
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",

    // Database
    "POSTGRES_URL",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_HOST",
    "POSTGRES_DATABASE",

    // AI Models
    "GROQ_API_KEY",
    "XAI_API_KEY",
  ]

  const missingVars = requiredVars.filter((varName) => {
    const value = process.env[varName]
    return !value || value.trim() === ""
  })

  return {
    allSet: missingVars.length === 0,
    missingVars,
    setVars: requiredVars.filter((v) => !missingVars.includes(v)),
  }
}

/**
 * Check if Supabase environment variables are correctly set
 */
export const checkSupabaseEnvVars = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  return {
    urlSet: !!supabaseUrl && supabaseUrl.includes("supabase.co"),
    anonKeySet: !!supabaseAnonKey && supabaseAnonKey.length > 20,
    serviceKeySet: !!supabaseServiceKey && supabaseServiceKey.length > 20,
    allSet: !!supabaseUrl && !!supabaseAnonKey && !!supabaseServiceKey,
  }
}

/**
 * Check if AI model environment variables are correctly set
 */
export const checkAIModelEnvVars = () => {
  const groqApiKey = process.env.GROQ_API_KEY
  const xaiApiKey = process.env.XAI_API_KEY

  return {
    groqSet: !!groqApiKey && groqApiKey.length > 10,
    xaiSet: !!xaiApiKey && xaiApiKey.length > 10,
    allSet: !!groqApiKey && !!xaiApiKey,
  }
}

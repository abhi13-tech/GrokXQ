import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Debug logging
console.log("Supabase Configuration:", {
  hasUrl: !!supabaseUrl,
  urlValid: supabaseUrl.startsWith("https://"),
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey.length,
  environment: process.env.NODE_ENV,
})

// Validate environment variables
const validateEnvironment = () => {
  const errors: string[] = []

  if (!supabaseUrl) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL is missing")
  } else if (!supabaseUrl.startsWith("https://")) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL must start with https://")
  } else if (!supabaseUrl.includes("supabase")) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL doesn't appear to be a valid Supabase URL")
  }

  if (!supabaseAnonKey) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing")
  } else if (supabaseAnonKey.length < 100) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid (too short)")
  }

  if (errors.length > 0) {
    console.error("Supabase configuration errors:", errors)
    return { isValid: false, errors }
  }

  console.log("Supabase configuration validated successfully")
  return { isValid: true, errors: [] }
}

// Validate on module load
const configValidation = validateEnvironment()

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export const supabase = (() => {
  if (supabaseInstance) return supabaseInstance

  if (!configValidation.isValid) {
    console.error("Cannot create Supabase client due to configuration errors:", configValidation.errors)
    // Return a mock client that throws errors for development
    return {
      auth: {
        signInWithPassword: () => Promise.reject(new Error("Supabase not configured")),
        signUp: () => Promise.reject(new Error("Supabase not configured")),
        signOut: () => Promise.reject(new Error("Supabase not configured")),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        resetPasswordForEmail: () => Promise.reject(new Error("Supabase not configured")),
        updateUser: () => Promise.reject(new Error("Supabase not configured")),
      },
      from: () => ({
        select: () => Promise.reject(new Error("Supabase not configured")),
        insert: () => Promise.reject(new Error("Supabase not configured")),
        update: () => Promise.reject(new Error("Supabase not configured")),
        delete: () => Promise.reject(new Error("Supabase not configured")),
      }),
    } as any
  }

  try {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: isBrowser,
        autoRefreshToken: isBrowser,
        detectSessionInUrl: isBrowser,
        flowType: "pkce",
      },
      global: {
        headers: {
          "X-Client-Info": "Groq Prompt Generator",
        },
      },
    })

    console.log("Supabase client created successfully")
    return supabaseInstance
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    throw error
  }
})()

// Simple connection test with better error handling
export const testConnection = async (): Promise<{ success: boolean; error?: string; duration?: number }> => {
  if (!configValidation.isValid) {
    return {
      success: false,
      error: `Configuration invalid: ${configValidation.errors.join(", ")}`,
      duration: 0,
    }
  }

  const startTime = Date.now()

  try {
    console.log("Testing Supabase connection...")

    // Test with a simple fetch request first
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
        method: "GET",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      const duration = Date.now() - startTime

      if (response.ok) {
        console.log(`Connection test successful (${duration}ms)`)
        return { success: true, duration }
      } else {
        const errorText = await response.text()
        console.error(`Connection test failed: HTTP ${response.status}`, errorText)
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          duration,
        }
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      const duration = Date.now() - startTime

      if (fetchError.name === "AbortError") {
        return {
          success: false,
          error: "Connection timeout (5 seconds)",
          duration,
        }
      }

      console.error("Fetch error:", fetchError)
      return {
        success: false,
        error: fetchError.message || "Network error",
        duration,
      }
    }
  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error("Connection test exception:", error)

    return {
      success: false,
      error: error.message || "Unknown error",
      duration,
    }
  }
}

// For server components and API routes
export const createServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || (process.env.NEXT_PUBLIC_SUPABASE_URL as string)
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Server environment variables are missing")
    throw new Error("Missing Supabase server environment variables")
  }

  try {
    return createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })
  } catch (error) {
    console.error("Error creating server client:", error)
    throw error
  }
}

export const checkAuthStatus = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()
    return {
      isAuthenticated: !!session,
      user: session?.user || null,
      error: error || null,
    }
  } catch (error: any) {
    return {
      isAuthenticated: false,
      user: null,
      error: { message: error.message, name: error.name },
    }
  }
}

// Export configuration status
export const isSupabaseConfigured = configValidation.isValid
export const configurationErrors = configValidation.errors

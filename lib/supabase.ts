import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Utility function to check if we're online
const isOnline = () => typeof navigator !== "undefined" && navigator.onLine

// Retry function with exponential backoff
const fetchWithRetry = async (url: RequestInfo | URL, options: RequestInit, retries = 3, backoff = 300) => {
  try {
    return await fetch(url, options)
  } catch (err) {
    if (retries === 0) {
      throw err
    }

    // Wait with exponential backoff
    await new Promise((resolve) => setTimeout(resolve, backoff))

    // Retry with one fewer retry and longer backoff
    return fetchWithRetry(url, options, retries - 1, backoff * 2)
  }
}

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Log environment variables (without exposing full keys)
console.log("[Supabase] Initializing with URL:", supabaseUrl)
console.log("[Supabase] Anon key available:", !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("[Supabase] Missing environment variables")
}

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: isBrowser, // Only persist session in browser environments
    autoRefreshToken: isBrowser,
    detectSessionInUrl: isBrowser,
  },
  global: {
    fetch: (...args) => {
      return fetch(...args).catch((error) => {
        console.error("[Supabase] Fetch error:", error)
        throw error
      })
    },
  },
})

// Log initialization status
console.log("[Supabase] Client initialized")

// Add a debug function to check auth status
export const checkAuthStatus = async () => {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error("[Supabase] Error checking auth status:", error)
      return { isAuthenticated: false, error }
    }
    return {
      isAuthenticated: !!data.session,
      user: data.session?.user || null,
      session: data.session,
    }
  } catch (error) {
    console.error("[Supabase] Exception checking auth status:", error)
    return { isAuthenticated: false, error }
  }
}

// Create a mock client for offline/error scenarios
const createMockClient = () => {
  // This is a simplified mock that returns empty data but doesn't throw errors
  const mockResponse = { data: null, error: null }

  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null }),
      signInWithPassword: () => Promise.resolve(mockResponse),
      signUp: () => Promise.resolve(mockResponse),
      signOut: () => Promise.resolve(mockResponse),
      resetPasswordForEmail: () => Promise.resolve(mockResponse),
      updateUser: () => Promise.resolve(mockResponse),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve(mockResponse),
          limit: () => Promise.resolve(mockResponse),
        }),
        order: () => ({
          limit: () => Promise.resolve(mockResponse),
        }),
      }),
      insert: () => Promise.resolve(mockResponse),
    }),
  } as any
}

// For server components and API routes
export const createServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || (process.env.NEXT_PUBLIC_SUPABASE_URL as string)
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("[Supabase] Server environment variables are missing")
    return createMockClient()
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  })
}

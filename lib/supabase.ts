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

// Create a single supabase client for the browser
const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables are missing:", {
      url: supabaseUrl ? "Set" : "Missing",
      key: supabaseAnonKey ? "Set" : "Missing",
    })
    // Return a mock client if environment variables are missing
    return createMockClient()
  }

  return createClient<Database>(supabaseUrl as string, supabaseAnonKey as string, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: async (url, options) => {
        // Check if we're online first
        if (!isOnline()) {
          console.warn("Offline: Unable to connect to Supabase")
          throw new Error("You are offline. Please check your internet connection.")
        }

        try {
          // Use retry mechanism for fetch
          return await fetchWithRetry(url, options)
        } catch (err) {
          console.error("Supabase fetch error:", err)
          throw err
        }
      },
    },
    // Increase timeouts
    realtime: {
      timeout: 60000, // 60 seconds
    },
  })
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

// For client components - with local storage fallback
let supabaseInstance: any
export const supabase =
  typeof window !== "undefined" ? supabaseInstance || (supabaseInstance = createBrowserClient()) : createMockClient()

// For server components and API routes
export const createServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || (process.env.NEXT_PUBLIC_SUPABASE_URL as string)
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Server Supabase environment variables are missing")
    return createMockClient()
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  })
}

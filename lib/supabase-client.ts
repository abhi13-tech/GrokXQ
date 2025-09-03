import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Configuration
const MOCK_MODE_ENABLED = true // Enable mock mode by default
const DIAGNOSTICS_ENABLED = true // Enable detailed diagnostics

// Mock data for offline/error scenarios
const MOCK_DATA = {
  profiles: [
    {
      id: "mock-user-id",
      email: "mock-user@example.com",
      full_name: "Mock User",
      avatar_url: null,
    },
  ],
  projects: [
    {
      id: "mock-project-id",
      name: "Mock Project",
      description: "A mock project for offline mode",
      user_id: "mock-user-id",
    },
  ],
  prompts: [],
  code_generations: [],
  code_reviews: [],
  tests: [],
}

// Diagnostic information
const diagnosticInfo = {
  lastAttempt: 0,
  attempts: 0,
  errors: [] as string[],
  connectionStatus: "unknown" as
    | "unknown"
    | "connected"
    | "disconnected"
    | "error"
    | "mock_mode"
    | "cors_issue"
    | "network_error"
    | "timeout",
  mockModeEnabled: MOCK_MODE_ENABLED,
}

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Log configuration
console.log("[SupabaseClient] Initializing with configuration:", {
  mockModeEnabled: MOCK_MODE_ENABLED,
  diagnosticsEnabled: DIAGNOSTICS_ENABLED,
  urlConfigured: !!supabaseUrl,
  keyConfigured: !!supabaseAnonKey,
  isBrowser,
})

// Create a mock client for offline/error scenarios
const createMockClient = () => {
  console.log("[SupabaseClient] Creating mock client")
  diagnosticInfo.connectionStatus = "mock_mode"

  return {
    auth: {
      getSession: () => {
        console.log("[MockClient] Getting session")
        return Promise.resolve({
          data: {
            session: {
              user: {
                id: "mock-user-id",
                email: "mock-user@example.com",
              },
            },
          },
          error: null,
        })
      },
      onAuthStateChange: (callback: any) => {
        console.log("[MockClient] Setting up auth state change listener")
        // Simulate an immediate auth state change
        setTimeout(() => {
          callback("SIGNED_IN", {
            user: {
              id: "mock-user-id",
              email: "mock-user@example.com",
            },
          })
        }, 100)

        return {
          data: {
            subscription: {
              unsubscribe: () => {
                console.log("[MockClient] Unsubscribing from auth state changes")
              },
            },
          },
          error: null,
        }
      },
      signInWithPassword: ({ email, password }: any) => {
        console.log("[MockClient] Signing in with password", { email })
        return Promise.resolve({
          data: {
            user: {
              id: "mock-user-id",
              email,
            },
            session: {
              user: {
                id: "mock-user-id",
                email,
              },
            },
          },
          error: null,
        })
      },
      signUp: ({ email, password, options }: any) => {
        console.log("[MockClient] Signing up", { email, options })
        return Promise.resolve({
          data: {
            user: {
              id: "mock-user-id",
              email,
              user_metadata: options?.data || {},
            },
            session: {
              user: {
                id: "mock-user-id",
                email,
              },
            },
          },
          error: null,
        })
      },
      signOut: () => {
        console.log("[MockClient] Signing out")
        return Promise.resolve({ error: null })
      },
      resetPasswordForEmail: (email: string) => {
        console.log("[MockClient] Resetting password for email", email)
        return Promise.resolve({ error: null })
      },
      updateUser: (updates: any) => {
        console.log("[MockClient] Updating user", updates)
        return Promise.resolve({ error: null })
      },
    },
    from: (table: string) => {
      console.log("[MockClient] Accessing table", table)
      const mockTable = MOCK_DATA[table as keyof typeof MOCK_DATA] || []

      return {
        select: (columns = "*") => {
          console.log("[MockClient] Selecting columns", columns)
          return {
            eq: (column: string, value: any) => {
              console.log("[MockClient] Filtering by equality", { column, value })
              const filtered = mockTable.filter((row: any) => row[column] === value)
              return {
                single: () => {
                  console.log("[MockClient] Getting single result")
                  return Promise.resolve({
                    data: filtered.length > 0 ? filtered[0] : null,
                    error: null,
                  })
                },
                limit: (limit: number) => {
                  console.log("[MockClient] Limiting results", limit)
                  return Promise.resolve({
                    data: filtered.slice(0, limit),
                    error: null,
                    count: filtered.length,
                  })
                },
              }
            },
            order: (column: string, { ascending = true } = {}) => {
              console.log("[MockClient] Ordering by", { column, ascending })
              return {
                limit: (limit: number) => {
                  console.log("[MockClient] Limiting results", limit)
                  return Promise.resolve({
                    data: mockTable.slice(0, limit),
                    error: null,
                    count: mockTable.length,
                  })
                },
              }
            },
            limit: (limit: number) => {
              console.log("[MockClient] Limiting results", limit)
              return Promise.resolve({
                data: mockTable.slice(0, limit),
                error: null,
                count: mockTable.length,
              })
            },
          }
        },
        insert: (data: any) => {
          console.log("[MockClient] Inserting data", data)
          return Promise.resolve({ data, error: null })
        },
        update: (data: any) => {
          console.log("[MockClient] Updating data", data)
          return {
            eq: (column: string, value: any) => {
              console.log("[MockClient] Filtering by equality for update", { column, value })
              return Promise.resolve({ data, error: null })
            },
          }
        },
        delete: () => {
          console.log("[MockClient] Deleting data")
          return {
            eq: (column: string, value: any) => {
              console.log("[MockClient] Filtering by equality for delete", { column, value })
              return Promise.resolve({ data: null, error: null })
            },
          }
        },
      }
    },
  } as any
}

// Function to test if Supabase is reachable
const testSupabaseConnection = async (): Promise<boolean> => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[SupabaseClient] Missing environment variables")
    return false
  }

  try {
    diagnosticInfo.lastAttempt = Date.now()
    diagnosticInfo.attempts++

    // Try a simple fetch to the Supabase URL
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseAnonKey}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      console.log("[SupabaseClient] Connection test successful")
      diagnosticInfo.connectionStatus = "connected"
      return true
    } else {
      console.error("[SupabaseClient] Connection test failed with status:", response.status)
      diagnosticInfo.connectionStatus = "error"
      diagnosticInfo.errors.push(`HTTP Error: ${response.status}`)
      return false
    }
  } catch (error: any) {
    console.error("[SupabaseClient] Connection test error:", error)

    // Categorize the error
    if (error.name === "AbortError") {
      diagnosticInfo.connectionStatus = "timeout"
      diagnosticInfo.errors.push("Connection timeout")
    } else if (error.message && error.message.includes("NetworkError")) {
      diagnosticInfo.connectionStatus = "network_error"
      diagnosticInfo.errors.push("Network error")
    } else if (error.message && error.message.includes("CORS")) {
      diagnosticInfo.connectionStatus = "cors_issue"
      diagnosticInfo.errors.push("CORS issue")
    } else {
      diagnosticInfo.connectionStatus = "error"
      diagnosticInfo.errors.push(error.message || "Unknown error")
    }

    return false
  }
}

// Create a real Supabase client
const createRealClient = () => {
  console.log("[SupabaseClient] Creating real Supabase client")

  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: isBrowser,
        autoRefreshToken: isBrowser,
        detectSessionInUrl: isBrowser,
      },
      global: {
        headers: {
          "X-Client-Info": "Groq Prompt Generator",
        },
      },
    })
  } catch (error) {
    console.error("[SupabaseClient] Error creating Supabase client:", error)
    diagnosticInfo.errors.push(`Client creation error: ${(error as Error).message}`)
    return createMockClient()
  }
}

// Decide whether to use mock or real client
const decideMockOrReal = async (): Promise<any> => {
  // If mock mode is explicitly enabled, use mock client
  if (MOCK_MODE_ENABLED) {
    console.log("[SupabaseClient] Mock mode is enabled, using mock client")
    return createMockClient()
  }

  // If we're missing environment variables, use mock client
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[SupabaseClient] Missing environment variables, using mock client")
    return createMockClient()
  }

  // Test if Supabase is reachable
  const isReachable = await testSupabaseConnection()

  if (isReachable) {
    console.log("[SupabaseClient] Supabase is reachable, using real client")
    return createRealClient()
  } else {
    console.log("[SupabaseClient] Supabase is not reachable, using mock client")
    return createMockClient()
  }
}

// Export a function to get the client
let clientPromise: Promise<any> | null = null

export const getSupabaseClient = async () => {
  if (!clientPromise) {
    clientPromise = decideMockOrReal()
  }
  return clientPromise
}

// Export a synchronous function that returns the mock client initially
// and then updates to the real client once it's available
let syncClient: any = createMockClient()

// Initialize the real client in the background
if (isBrowser) {
  getSupabaseClient().then((client) => {
    syncClient = client
    console.log("[SupabaseClient] Client updated")
  })
}

export const supabase = syncClient

// Export diagnostic information
export const getDiagnosticInfo = () => {
  return {
    ...diagnosticInfo,
    timestamp: Date.now(),
  }
}

// Export a function to force refresh the client
export const refreshSupabaseClient = async () => {
  clientPromise = null
  const newClient = await getSupabaseClient()
  syncClient = newClient
  return newClient
}

// For server components and API routes
export const createServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || (process.env.NEXT_PUBLIC_SUPABASE_URL as string)
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("[SupabaseClient] Server environment variables are missing")
    return createMockClient()
  }

  try {
    return createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })
  } catch (error) {
    console.error("[SupabaseClient] Error creating server client:", error)
    return createMockClient()
  }
}

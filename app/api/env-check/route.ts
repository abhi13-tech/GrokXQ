import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { checkRequiredEnvVars, checkSupabaseEnvVars, checkAIModelEnvVars } from "@/lib/env-checker"

export async function GET() {
  // Only allow in development or with admin token
  if (process.env.NODE_ENV !== "development") {
    const authHeader = headers().get("authorization")
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const requiredVarsCheck = checkRequiredEnvVars()
  const supabaseCheck = checkSupabaseEnvVars()
  const aiModelCheck = checkAIModelEnvVars()

  // Test database connection
  let dbConnectionStatus = "Not tested"
  try {
    // Simple check if we can connect to the database
    const { createServerClient } = await import("@/lib/supabase")
    const supabase = createServerClient()
    const { data, error } = await supabase.from("profiles").select("count").limit(1)

    if (error) {
      dbConnectionStatus = `Error: ${error.message}`
    } else {
      dbConnectionStatus = "Connected successfully"
    }
  } catch (error: any) {
    dbConnectionStatus = `Exception: ${error.message}`
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    requiredVarsCheck: {
      allSet: requiredVarsCheck.allSet,
      missingCount: requiredVarsCheck.missingVars.length,
      setCount: requiredVarsCheck.setVars.length,
    },
    supabaseCheck,
    aiModelCheck,
    dbConnectionStatus,
  })
}

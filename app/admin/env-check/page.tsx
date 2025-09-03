"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { checkAuthStatus } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"

export default function EnvCheckPage() {
  const { user } = useAuth()
  const [envStatus, setEnvStatus] = useState<Record<string, boolean | string>>({})
  const [authStatus, setAuthStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check environment variables
  useEffect(() => {
    const checkEnvVariables = async () => {
      setIsLoading(true)

      // Check Supabase variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      // Check AI model variables
      const groqApiKey = process.env.GROQ_API_KEY ? "Set (hidden)" : undefined
      const xaiApiKey = process.env.XAI_API_KEY ? "Set (hidden)" : undefined

      // Check auth status
      const status = await checkAuthStatus()
      setAuthStatus(status)

      // Set environment status
      setEnvStatus({
        NEXT_PUBLIC_SUPABASE_URL: supabaseUrl || false,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? "Set (hidden)" : false,
        GROQ_API_KEY: groqApiKey || false,
        XAI_API_KEY: xaiApiKey || false,
      })

      setIsLoading(false)
    }

    checkEnvVariables()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables Check</CardTitle>
          <CardDescription>Verify that all required environment variables are set correctly</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading environment status...</div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Environment Variables</h3>
                <div className="space-y-2">
                  {Object.entries(envStatus).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 border rounded">
                      <span className="font-mono text-sm">{key}</span>
                      <Badge variant={value ? "default" : "destructive"}>
                        {value ? (typeof value === "string" ? value : "Set") : "Missing"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Authentication Status</h3>
                <div className="p-4 border rounded bg-gray-50 dark:bg-gray-900">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(
                      {
                        isAuthenticated: authStatus?.isAuthenticated || false,
                        user: user
                          ? {
                              id: user.id,
                              email: user.email,
                              lastSignIn: user.last_sign_in_at,
                            }
                          : null,
                        error: authStatus?.error
                          ? {
                              message: authStatus.error.message,
                              name: authStatus.error.name,
                            }
                          : null,
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => window.location.reload()}>Refresh Status</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

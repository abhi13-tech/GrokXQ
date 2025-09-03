"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

interface ConfigCheck {
  name: string
  value: string | undefined
  isValid: boolean
  message: string
}

export default function ConfigCheckPage() {
  const [checks, setChecks] = useState<ConfigCheck[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [connectionTest, setConnectionTest] = useState<{
    status: "idle" | "testing" | "success" | "error"
    message: string
  }>({ status: "idle", message: "" })

  const runConfigChecks = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const newChecks: ConfigCheck[] = [
      {
        name: "NEXT_PUBLIC_SUPABASE_URL",
        value: supabaseUrl,
        isValid: !!(supabaseUrl && supabaseUrl.startsWith("https://") && supabaseUrl.includes("supabase")),
        message: supabaseUrl
          ? supabaseUrl.startsWith("https://")
            ? "✓ Valid Supabase URL format"
            : "✗ URL must start with https://"
          : "✗ Environment variable not set",
      },
      {
        name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        value: supabaseKey,
        isValid: !!(supabaseKey && supabaseKey.length > 100),
        message: supabaseKey
          ? supabaseKey.length > 100
            ? "✓ Valid API key format"
            : "✗ API key appears to be too short"
          : "✗ Environment variable not set",
      },
    ]

    setChecks(newChecks)
    setIsLoading(false)
  }

  const testConnection = async () => {
    setConnectionTest({ status: "testing", message: "Testing connection..." })

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing configuration")
      }

      // Test with a simple fetch to the auth endpoint
      const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
        method: "GET",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      })

      if (response.ok) {
        setConnectionTest({
          status: "success",
          message: "✓ Successfully connected to Supabase",
        })
      } else {
        setConnectionTest({
          status: "error",
          message: `✗ Connection failed: HTTP ${response.status} ${response.statusText}`,
        })
      }
    } catch (error: any) {
      setConnectionTest({
        status: "error",
        message: `✗ Connection failed: ${error.message}`,
      })
    }
  }

  useEffect(() => {
    runConfigChecks()
  }, [])

  const allValid = checks.every((check) => check.isValid)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Configuration Check</CardTitle>
            <CardDescription>Verify that your Supabase configuration is correct</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
                <span className="ml-2">Checking configuration...</span>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Environment Variables</h3>
                  {checks.map((check) => (
                    <div key={check.name} className="flex items-start gap-3 p-3 border rounded-lg">
                      {check.isValid ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{check.name}</div>
                        <div className="text-sm text-gray-600">{check.message}</div>
                        {check.value && (
                          <div className="text-xs text-gray-400 mt-1 font-mono break-all">
                            {check.name.includes("KEY") ? `${check.value.substring(0, 20)}...` : check.value}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Connection Test</h3>
                  <div className="flex items-center gap-3">
                    <Button onClick={testConnection} disabled={!allValid || connectionTest.status === "testing"}>
                      {connectionTest.status === "testing" ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                      Test Connection
                    </Button>
                    {connectionTest.message && (
                      <div
                        className={`flex items-center gap-2 ${
                          connectionTest.status === "success"
                            ? "text-green-600"
                            : connectionTest.status === "error"
                              ? "text-red-600"
                              : "text-gray-600"
                        }`}
                      >
                        {connectionTest.status === "success" && <CheckCircle className="h-4 w-4" />}
                        {connectionTest.status === "error" && <XCircle className="h-4 w-4" />}
                        <span>{connectionTest.message}</span>
                      </div>
                    )}
                  </div>
                </div>

                {!allValid && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Configuration Issues Found</AlertTitle>
                    <AlertDescription>
                      Please fix the configuration issues above before using the application. Make sure you have set up
                      your Supabase project and added the environment variables to your deployment.
                    </AlertDescription>
                  </Alert>
                )}

                {allValid && connectionTest.status === "success" && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Configuration Valid</AlertTitle>
                    <AlertDescription>
                      Your Supabase configuration is correct and the connection test passed. You can now use the
                      application.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

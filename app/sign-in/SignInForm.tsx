"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw, Settings, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({})
  const { signIn, connectionStatus, connectionError, testConnection } = useAuth()

  // Validate email
  const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return null
  }

  // Validate password
  const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required"
    if (password.length < 6) return "Password must be at least 6 characters long"
    return null
  }

  // Handle input changes with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)

    if (validationErrors.email) {
      const emailError = validateEmail(value)
      setValidationErrors((prev) => ({ ...prev, email: emailError || undefined }))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)

    if (validationErrors.password) {
      const passwordError = validatePassword(value)
      setValidationErrors((prev) => ({ ...prev, password: passwordError || undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate inputs
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    if (emailError || passwordError) {
      setValidationErrors({
        email: emailError || undefined,
        password: passwordError || undefined,
      })
      return
    }

    setValidationErrors({})
    setIsLoading(true)

    try {
      await signIn(email, password)
    } catch (err: any) {
      console.error("Sign in error:", err)

      // Provide more specific error messages
      let errorMessage = err.message || "Failed to sign in"

      if (errorMessage.includes("Failed to fetch")) {
        errorMessage =
          "Unable to connect to the authentication service. This could be due to network issues or incorrect configuration."
      } else if (errorMessage.includes("Supabase not configured")) {
        errorMessage = "The application is not properly configured. Please check the configuration."
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetryConnection = async () => {
    setIsLoading(true)
    try {
      await testConnection()
    } finally {
      setIsLoading(false)
    }
  }

  // Show configuration error
  if (connectionStatus === "misconfigured") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Error
          </CardTitle>
          <CardDescription>The application is not properly configured</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Configuration Issue</AlertTitle>
            <AlertDescription>
              {connectionError || "Supabase is not properly configured. Please check your environment variables."}
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button variant="outline" className="w-full" onClick={handleRetryConnection} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Retry Configuration Check
          </Button>
          <Link href="/config-check" className="w-full">
            <Button variant="secondary" className="w-full">
              <Settings className="mr-2 h-4 w-4" />
              Check Configuration
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        {connectionStatus === "error" && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <span>
                {connectionError || "Unable to connect to the server. Please check your internet connection."}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleRetryConnection} disabled={isLoading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  Retry
                </Button>
                <Link href="/config-check">
                  <Button size="sm" variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Check Config
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={handleEmailChange}
              className={validationErrors.email ? "border-red-500" : ""}
              required
            />
            {validationErrors.email && <p className="text-sm text-red-500">{validationErrors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              className={validationErrors.password ? "border-red-500" : ""}
              required
            />
            {validationErrors.password && <p className="text-sm text-red-500">{validationErrors.password}</p>}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="flex flex-col gap-2">
                <span>{error}</span>
                {error.includes("configuration") && (
                  <Link href="/config-check">
                    <Button size="sm" variant="outline">
                      <Settings className="mr-2 h-4 w-4" />
                      Check Configuration
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || connectionStatus === "error" || connectionStatus === "misconfigured"}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <div className="text-sm text-center w-full">
          <Link href="/reset-password" className="text-primary hover:underline">
            Forgot your password?
          </Link>
        </div>
        <div className="text-sm text-center w-full">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
        <div className="text-xs text-center w-full text-gray-500">
          Having issues?{" "}
          <Link href="/config-check" className="text-primary hover:underline">
            Check configuration
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

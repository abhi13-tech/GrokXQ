"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function AuthTestPage() {
  const [testEmail, setTestEmail] = useState(`test-user-${Date.now()}@example.com`)
  const [testPassword, setTestPassword] = useState("password123")
  const [testName, setTestName] = useState("Test User")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [session, setSession] = useState<any>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Log test results
  const logResult = (message: string) => {
    setResults((prev) => [...prev, `${new Date().toISOString()}: ${message}`])
  }

  // Check current session
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      if (data.session) {
        logResult(`✅ Currently logged in as: ${data.session.user.email}`)
      } else {
        logResult(`ℹ️ No active session`)
      }
    }

    checkSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      logResult(`🔔 Auth event: ${event}`)
      setSession(session)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Test sign up
  const testSignUp = async () => {
    try {
      setLoading(true)
      logResult(`🧪 Testing Sign Up with email: ${testEmail}`)

      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: testName,
          },
        },
      })

      if (error) throw error

      logResult(`✅ Sign Up successful for user: ${data.user?.id}`)
      toast({
        title: "Sign Up Successful",
        description: "Your account has been created successfully.",
      })

      // Wait a moment for the trigger to execute
      setTimeout(async () => {
        await testProfileCreation(data.user?.id)
      }, 1000)
    } catch (error: any) {
      logResult(`❌ Sign Up failed: ${error.message}`)
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Test profile creation
  const testProfileCreation = async (userId?: string) => {
    if (!userId) {
      logResult(`❌ Cannot test profile creation: No user ID`)
      return
    }

    try {
      logResult(`🧪 Testing Profile Creation for user: ${userId}`)

      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) throw error

      if (data) {
        logResult(`✅ Profile created successfully: ${JSON.stringify(data)}`)
      } else {
        logResult(`❌ Profile not found for user: ${userId}`)
      }
    } catch (error: any) {
      logResult(`❌ Profile creation test failed: ${error.message}`)
    }
  }

  // Test sign in
  const testSignIn = async () => {
    try {
      setLoading(true)
      logResult(`🧪 Testing Sign In with email: ${testEmail}`)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      })

      if (error) throw error

      logResult(`✅ Sign In successful for user: ${data.user.id}`)
      toast({
        title: "Sign In Successful",
        description: "You have been signed in successfully.",
      })

      // Test redirection
      logResult(`🧪 Testing redirection to dashboard...`)
      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      logResult(`❌ Sign In failed: ${error.message}`)
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Test sign out
  const testSignOut = async () => {
    try {
      setLoading(true)
      logResult(`🧪 Testing Sign Out`)

      const { error } = await supabase.auth.signOut()

      if (error) throw error

      logResult(`✅ Sign Out successful`)
      toast({
        title: "Sign Out Successful",
        description: "You have been signed out successfully.",
      })

      // Test redirection
      logResult(`🧪 Testing redirection to home page...`)
      router.push("/")
      router.refresh()
    } catch (error: any) {
      logResult(`❌ Sign Out failed: ${error.message}`)
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Authentication Flow Test</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
            <CardDescription>Configure test user credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Test Email</Label>
              <Input
                id="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Test Password</Label>
              <Input
                id="password"
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="password123"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Test Full Name</Label>
              <Input id="name" value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="Test User" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="w-full flex flex-col space-y-2">
              <Button onClick={testSignUp} disabled={loading} className="w-full">
                Test Sign Up
              </Button>
              <Button onClick={testSignIn} disabled={loading} className="w-full">
                Test Sign In
              </Button>
              <Button onClick={testSignOut} disabled={loading} className="w-full" variant="outline">
                Test Sign Out
              </Button>
            </div>
            <div className="w-full pt-4">
              <div className="text-sm font-medium">Current Session:</div>
              <div className="text-sm">
                {session ? (
                  <span className="text-green-600">Logged in as {session.user.email}</span>
                ) : (
                  <span className="text-red-600">Not logged in</span>
                )}
              </div>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Real-time authentication test logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-950 text-slate-50 p-4 rounded-md h-[400px] overflow-y-auto font-mono text-sm">
              {results.length === 0 ? (
                <div className="text-slate-400">No test results yet. Run a test to see logs.</div>
              ) : (
                results.map((result, index) => (
                  <div key={index} className="pb-1">
                    {result}
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => setResults([])} className="w-full">
              Clear Logs
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

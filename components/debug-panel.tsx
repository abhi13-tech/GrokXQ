"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export function DebugPanel() {
  const { user, profile, session, isLoading, isOffline } = useAuth()
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  const checkStatus = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      setSupabaseStatus({
        isAuthenticated: !!session,
        user: session?.user || null,
        error: error || null,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      setSupabaseStatus({
        error: error,
        timestamp: new Date().toISOString(),
      })
    }
  }

  if (!isVisible) {
    return (
      <Button
        className="fixed bottom-4 right-4 z-50 opacity-50 hover:opacity-100"
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
      >
        Debug
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-auto shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <CardTitle className="text-sm">Debug Panel</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
          Close
        </Button>
      </CardHeader>
      <CardContent className="text-xs space-y-4">
        <div>
          <h3 className="font-bold mb-1">Auth Context</h3>
          <div className="space-y-1">
            <p>
              <span className="font-semibold">Loading:</span> {isLoading ? "Yes" : "No"}
            </p>
            <p>
              <span className="font-semibold">Offline:</span> {isOffline ? "Yes" : "No"}
            </p>
            <p>
              <span className="font-semibold">User:</span> {user ? user.email : "Not authenticated"}
            </p>
            <p>
              <span className="font-semibold">Profile:</span> {profile ? "Loaded" : "Not loaded"}
            </p>
            <p>
              <span className="font-semibold">Session:</span> {session ? "Active" : "None"}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-1">Supabase Status</h3>
          <Button size="sm" onClick={checkStatus} className="mb-2">
            Check Supabase Status
          </Button>

          {supabaseStatus && (
            <div className="space-y-1 border p-2 rounded text-xs">
              <p>
                <span className="font-semibold">Auth Status:</span>
                {supabaseStatus.isAuthenticated ? " Authenticated" : " Not authenticated"}
              </p>
              {supabaseStatus.user && (
                <p>
                  <span className="font-semibold">User Email:</span> {supabaseStatus.user.email}
                </p>
              )}
              {supabaseStatus.error && (
                <p className="text-red-500">
                  <span className="font-semibold">Error:</span> {supabaseStatus.error.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">Checked at: {supabaseStatus.timestamp}</p>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-bold mb-1">Environment</h3>
          <div className="space-y-1">
            <p>
              <span className="font-semibold">Supabase URL:</span>{" "}
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set"}
            </p>
            <p>
              <span className="font-semibold">Anon Key:</span>{" "}
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set"}
            </p>
            <p>
              <span className="font-semibold">Browser:</span>{" "}
              {typeof window !== "undefined" ? window.navigator.userAgent : "SSR"}
            </p>
          </div>
        </div>

        <Button size="sm" onClick={() => window.location.reload()} className="w-full">
          Reload Page
        </Button>
      </CardContent>
    </Card>
  )
}

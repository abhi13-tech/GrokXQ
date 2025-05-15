"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

type AuthContextType = {
  user: User | null
  profile: Profile | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error(error)
        setIsLoading(false)
        return
      }

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        setProfile(profileData)
      }

      setIsLoading(false)
    }

    setData()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()
        setProfile(profileData)

        // Refresh the page to ensure all components reflect the authenticated state
        if (event === "SIGNED_IN") {
          router.refresh()
        }
      } else {
        setProfile(null)

        // Refresh the page to ensure all components reflect the unauthenticated state
        if (event === "SIGNED_OUT") {
          router.refresh()
        }
      }

      setIsLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  const signIn = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        throw error
      }

      // Redirect to dashboard after successful sign-in
      router.push("/dashboard")
      router.refresh()

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // First, create the auth user
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      // If email confirmation is required
      if (data?.user && !data.session) {
        toast({
          title: "Account created",
          description: "Please check your email to verify your account.",
        })
        return
      }

      // If auto-confirmed, ensure profile exists
      if (data?.user) {
        // Check if profile exists
        const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", data.user.id).single()

        // Create profile if it doesn't exist
        if (!existingProfile) {
          const { error: profileError } = await supabase.from("profiles").insert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            avatar_url: null,
          })

          if (profileError) {
            console.error("Error creating profile:", profileError)
          }
        }

        // Redirect to dashboard after successful sign-up
        router.push("/dashboard")
        router.refresh()

        toast({
          title: "Account created",
          description: "Your account has been created successfully.",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()

      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Password reset email sent",
        description: "Please check your email for the password reset link.",
      })
    } catch (error: any) {
      toast({
        title: "Error resetting password",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

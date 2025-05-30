"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Local storage keys
const USER_STORAGE_KEY = "app_user"
const PROFILE_STORAGE_KEY = "app_profile"

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
  isOffline: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper functions for local storage
const saveToLocalStorage = (key: string, value: any) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error)
  }
}

const getFromLocalStorage = (key: string) => {
  if (typeof window === "undefined") return null
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error)
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Debug function to log auth state
  const logAuthState = (message: string) => {
    console.log(`[Auth] ${message}`, {
      user: user?.email || "null",
      isAuthenticated: !!user,
      isLoading,
      isOffline,
    })
  }

  // Function to fetch user profile with error handling
  const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
    if (isOffline) {
      console.log("Offline: Using cached profile data")
      return getFromLocalStorage(PROFILE_STORAGE_KEY)
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (profileError) {
        console.error("Error fetching profile:", profileError)
        // Fall back to cached data if available
        return getFromLocalStorage(PROFILE_STORAGE_KEY)
      }

      if (profileData) {
        // Cache the profile data
        saveToLocalStorage(PROFILE_STORAGE_KEY, profileData)
        return profileData
      }

      return null
    } catch (error) {
      console.error("Exception fetching profile:", error)
      // Fall back to cached data if available
      return getFromLocalStorage(PROFILE_STORAGE_KEY)
    }
  }

  // Function to refresh auth state
  const refreshAuthState = async () => {
    try {
      logAuthState("Refreshing auth state")
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error("Error getting session:", error)
        return
      }

      setSession(session)

      if (session?.user) {
        logAuthState(`Session found for user: ${session.user.email}`)
        setUser(session.user)
        saveToLocalStorage(USER_STORAGE_KEY, session.user)

        // Try to fetch profile
        const profileData = await fetchUserProfile(session.user.id)
        if (profileData) {
          setProfile(profileData)
          logAuthState("Profile loaded successfully")
        } else {
          logAuthState("No profile found for user")
        }
      } else {
        logAuthState("No active session found")
        setUser(null)
        setProfile(null)
      }
    } catch (error) {
      console.error("Error refreshing auth state:", error)
    }
  }

  // Function to refresh the user profile
  const refreshProfile = async () => {
    if (!user) return

    try {
      const profileData = await fetchUserProfile(user.id)
      if (profileData) {
        setProfile(profileData)
      }
    } catch (error) {
      console.error("Error refreshing profile:", error)
    }
  }

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      console.log("App is online")
      // Try to refresh data when coming back online
      refreshAuthState()
    }

    const handleOffline = () => {
      setIsOffline(true)
      console.log("App is offline")
      // Load from local storage when offline
      const cachedUser = getFromLocalStorage(USER_STORAGE_KEY)
      const cachedProfile = getFromLocalStorage(PROFILE_STORAGE_KEY)

      if (cachedUser) {
        setUser(cachedUser)
        setProfile(cachedProfile)
      }
    }

    if (typeof window !== "undefined") {
      // Set initial state
      setIsOffline(!navigator.onLine)

      // Add event listeners
      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)

      // Clean up
      return () => {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      }
    }
  }, [])

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true)
        logAuthState("Initializing auth")

        // Try to get cached data first for faster loading
        const cachedUser = getFromLocalStorage(USER_STORAGE_KEY)
        const cachedProfile = getFromLocalStorage(PROFILE_STORAGE_KEY)

        if (cachedUser) {
          logAuthState("Using cached user data")
          setUser(cachedUser)
          setProfile(cachedProfile)
        }

        // Then try to get fresh data from Supabase
        await refreshAuthState()
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setIsLoading(false)
        logAuthState("Auth initialization complete")
      }
    }

    initializeAuth()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)

      try {
        setSession(session)

        if (session?.user) {
          logAuthState(`Auth state changed: ${event} for user ${session.user.email}`)
          setUser(session.user)
          saveToLocalStorage(USER_STORAGE_KEY, session.user)

          // Try to fetch profile
          try {
            const profileData = await fetchUserProfile(session.user.id)
            if (profileData) {
              setProfile(profileData)
            }
          } catch (profileError) {
            console.error("Error fetching profile after auth change:", profileError)
            // Continue even if profile fetch fails
          }

          // Refresh the page to ensure all components reflect the authenticated state
          if (event === "SIGNED_IN") {
            logAuthState("User signed in, redirecting to dashboard")
            router.push("/dashboard")
          }
        } else {
          logAuthState(`Auth state changed: ${event}, no user`)
          setUser(null)
          setProfile(null)

          // Clear local storage on sign out
          if (event === "SIGNED_OUT") {
            localStorage.removeItem(USER_STORAGE_KEY)
            localStorage.removeItem(PROFILE_STORAGE_KEY)
            router.push("/")
          }
        }
      } catch (error) {
        console.error("Error handling auth state change:", error)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  const signIn = async (email: string, password: string) => {
    try {
      if (isOffline) {
        toast({
          title: "You are offline",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        })
        return
      }

      logAuthState(`Attempting to sign in with email: ${email}`)
      const { error, data } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        console.error("Supabase auth error:", error)
        throw error
      }

      logAuthState("Sign in successful")

      // Set user and session immediately
      setUser(data.user)
      setSession(data.session)
      saveToLocalStorage(USER_STORAGE_KEY, data.user)

      // Try to fetch profile, but don't block sign-in if it fails
      try {
        if (data.user) {
          const profileData = await fetchUserProfile(data.user.id)
          if (profileData) {
            setProfile(profileData)
          }
        }
      } catch (profileError) {
        console.error("Error fetching profile during sign-in:", profileError)
        // Continue with sign-in even if profile fetch fails
      }

      // Redirect to dashboard after successful sign-in
      logAuthState("Redirecting to dashboard after sign in")
      router.push("/dashboard")

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })
    } catch (error: any) {
      console.error("Error signing in:", error)
      toast({
        title: "Error signing in",
        description: error.message || "Failed to sign in. Please check your credentials and try again.",
        variant: "destructive",
      })

      throw error
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      if (isOffline) {
        toast({
          title: "You are offline",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        })
        return
      }

      logAuthState(`Attempting to sign up with email: ${email}`)
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
        logAuthState("User created successfully, creating profile")
        // Try to create profile, but don't block sign-up if it fails
        try {
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
        } catch (profileError) {
          console.error("Error checking/creating profile:", profileError)
          // Continue with sign-up even if profile creation fails
        }

        // Set user and session immediately
        setUser(data.user)
        setSession(data.session)
        saveToLocalStorage(USER_STORAGE_KEY, data.user)

        // Redirect to dashboard after successful sign-up
        logAuthState("Redirecting to dashboard after sign up")
        router.push("/dashboard")

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
      logAuthState("Signing out")
      if (!isOffline) {
        await supabase.auth.signOut()
      }

      // Clear state and local storage regardless of online status
      setUser(null)
      setProfile(null)
      setSession(null)
      localStorage.removeItem(USER_STORAGE_KEY)
      localStorage.removeItem(PROFILE_STORAGE_KEY)

      router.push("/")

      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })
    } catch (error: any) {
      console.error("Error signing out:", error)

      // Force sign out even if the API call fails
      setUser(null)
      setProfile(null)
      setSession(null)
      localStorage.removeItem(USER_STORAGE_KEY)
      localStorage.removeItem(PROFILE_STORAGE_KEY)

      router.push("/")

      toast({
        title: "Signed out",
        description: "You have been signed out with some errors.",
      })
    }
  }

  const resetPassword = async (email: string) => {
    try {
      if (isOffline) {
        toast({
          title: "You are offline",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        })
        return
      }

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
      if (isOffline) {
        toast({
          title: "You are offline",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        })
        return
      }

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

  const value = {
    user,
    profile,
    session,
    isLoading,
    isOffline,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

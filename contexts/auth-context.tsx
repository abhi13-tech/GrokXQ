"use client"

import type React from "react"
import { createContext, useContext } from "react"
import type { Session } from "@supabase/supabase-js"

// Local storage keys
const USER_STORAGE_KEY = "app_user"
const PROFILE_STORAGE_KEY = "app_profile"

// Mock user type to maintain compatibility
type User = {
  id: string
  email: string
}

// Mock profile type to maintain compatibility
type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

type ConnectionStatus = "connected" | "connecting" | "error" | "unknown" | "misconfigured"

// A simplified version of the auth context
type AuthContextType = {
  // Always return a mock user to simulate being logged in
  user: User
  profile: Profile
  session: Session | null
  isLoading: boolean
  connectionStatus: ConnectionStatus
  connectionError: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  refreshProfile: () => Promise<void>
  testConnection: () => Promise<boolean>
}

// Create a mock user and profile
const mockUser: User = {
  id: "mock-user-id",
  email: "user@example.com",
}

const mockProfile: Profile = {
  id: "mock-user-id",
  email: "user@example.com",
  full_name: "Example User",
  avatar_url: null,
}

const AuthContext = createContext<AuthContextType>({
  user: mockUser,
  profile: mockProfile,
  session: null,
  isLoading: false,
  connectionStatus: "connected",
  connectionError: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updatePassword: async () => {},
  refreshProfile: async () => {},
  testConnection: async () => true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Always return mock data to simulate being logged in
  const value = {
    user: mockUser,
    profile: mockProfile,
    session: null,
    isLoading: false,
    connectionStatus: "connected",
    connectionError: null,
    signIn: async () => {},
    signUp: async () => {},
    signOut: async () => {},
    resetPassword: async () => {},
    updatePassword: async () => {},
    refreshProfile: async () => {},
    testConnection: async () => true,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}

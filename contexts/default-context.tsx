"use client"

import { createContext, useContext, type ReactNode } from "react"

type DefaultContextType = {
  user: {
    id: string
    name: string
    email: string
    image: string
  }
}

const defaultUser = {
  id: "guest-user",
  name: "Guest User",
  email: "guest@example.com",
  image: "/abstract-user-avatar.png",
}

const DefaultContext = createContext<DefaultContextType>({
  user: defaultUser,
})

export function DefaultProvider({ children }: { children: ReactNode }) {
  return (
    <DefaultContext.Provider
      value={{
        user: defaultUser,
      }}
    >
      {children}
    </DefaultContext.Provider>
  )
}

export const useDefault = () => useContext(DefaultContext)

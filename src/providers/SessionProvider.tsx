'use client'

import { createContext, useContext, ReactNode } from 'react'
import { User } from '@/types'

// Define Session type
export interface Session {
  user: User | null
  expires?: string
}

// Define what your session context holds
export interface SessionContextType {
  user: User | null
}

// Create the context with a default value
const SessionContext = createContext<SessionContextType>({
  user: null
})

// Hook to use the session context
export function useSession() {
  return useContext(SessionContext)
}

// Updated provider component that accepts a 'session' prop
export default function SessionProvider({ children, session }: { children: ReactNode; session: Session | null }) {
  // Create a value object to pass to the context provider
  const value = {
    user: session?.user || null

    // Add other session properties as needed
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

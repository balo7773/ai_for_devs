"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'

/**
 * Defines the shape of the authentication context, including user, session,
 * and authentication methods.
 */
interface AuthContextType {
  /** The current authenticated user, or null if not logged in. */
  user: User | null
  /** The current session, or null if not logged in. */
  session: Session | null
  /** Function to sign up a new user. */
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>
  /** Function to sign in a user. */
  signIn: (email: string, password: string) => Promise<{ error: any }>
  /** Function to sign out the current user. */
  signOut: () => Promise<void>
  /** A boolean indicating if the authentication state is currently being loaded. */
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let unsubscribe: () => void

    /**
     * Sets up the Supabase authentication listener.
     * It fetches the initial session and subscribes to auth state changes.
     * Includes a fallback for development environments where Supabase might not be configured.
     */
    const setupSupabaseListener = async () => {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()

        const { data } = await supabase.auth.getSession()
        setSession(data.session)
        setUser(data.session?.user || null)
        setIsLoading(false)

        // Listen for changes in authentication state (e.g., sign in, sign out)
        unsubscribe = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
          setUser(session?.user || null)
          setIsLoading(false)
        }).data.subscription.unsubscribe
      } else {
        // Fallback for development without Supabase
        // This allows UI development without a live Supabase backend.
        const storedUser = localStorage.getItem('auth-user')
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser)
            setUser(userData)
            setSession({ user: userData, access_token: 'mock-token', refresh_token: 'mock-token' } as Session)
          } catch (error) {
            console.error('Error parsing stored user:', error)
          }
        }
        setIsLoading(false)
      }
    }

    setupSupabaseListener()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  /**
   * Signs up a new user with email, password, and name.
   * @param email - The user's email address.
   * @param password - The user's chosen password.
   * @param name - The user's full name.
   * @returns A promise that resolves with an error object if signup fails.
   */
  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Check if Supabase is configured
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // Use Supabase if configured
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            }
          }
        })
        if (data?.user && data?.session) {
          setUser(data.user)
          setSession(data.session)
        }
        return { error }
      } else {
        // Fallback for development without Supabase
        const mockUser = {
          id: Date.now().toString(),
          email: email,
          user_metadata: { name: name },
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          role: 'authenticated',
          email_confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          phone: undefined,
          confirmed_at: new Date().toISOString(),
          last_sign_in_with: 'email',
          identities: [],
          factors: [],
        } as unknown as User

        setUser(mockUser)
        setSession({ user: mockUser, access_token: 'mock-token', refresh_token: 'mock-token' } as Session)
        localStorage.setItem('auth-user', JSON.stringify(mockUser))
        
        return { error: null }
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { error: { message: 'Registration failed. Please try again.' } }
    }
  }

  /**
   * Signs in a user with their email and password.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns A promise that resolves with an error object if sign-in fails.
   */
  const signIn = async (email: string, password: string) => {
    try {
      // Check if Supabase is configured
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // Use Supabase if configured
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (data?.user && data?.session) {
          setUser(data.user)
          setSession(data.session)
        }
        return { error }
      } else {
        // Fallback for development without Supabase
        const storedUser = localStorage.getItem('auth-user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          if (userData.email === email) {
            setUser(userData)
            setSession({ user: userData, access_token: 'mock-token', refresh_token: 'mock-token' } as Session)
            return { error: null }
          }
        }
        return { error: { message: 'Invalid email or password' } }
      }
    } catch (error) {
      console.error('Signin error:', error)
      return { error: { message: 'Login failed. Please try again.' } }
    }
  }

  /**
   * Signs out the currently authenticated user.
   */
  const signOut = async () => {
    try {
      // Check if Supabase is configured
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // Use Supabase if configured
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        await supabase.auth.signOut()
      } else {
        // Fallback for development without Supabase
        setUser(null)
        setSession(null)
        localStorage.removeItem('auth-user')
      }
    } catch (error) {
      console.error('Signout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      signUp, 
      signIn, 
      signOut, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook to access the authentication context.
 * Must be used within a component wrapped by `AuthProvider`.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

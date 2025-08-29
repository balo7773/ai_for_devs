"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session in localStorage (fallback)
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
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Check if Supabase is configured
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // Use Supabase if configured
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            }
          }
        })
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

  const signIn = async (email: string, password: string) => {
    try {
      // Check if Supabase is configured
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // Use Supabase if configured
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
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

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session/token
    const token = localStorage.getItem('auth-token')
    if (token) {
      // Validate token and set user
      // This would typically make an API call to validate the token
      setUser({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com'
      })
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // This would typically make an API call to authenticate
      // For now, we'll simulate a successful login
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: email
      }
      setUser(mockUser)
      localStorage.setItem('auth-token', 'mock-token')
    } catch (error) {
      throw new Error('Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth-token')
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // This would typically make an API call to register
      // For now, we'll simulate a successful registration
      const mockUser = {
        id: '1',
        name: name,
        email: email
      }
      setUser(mockUser)
      localStorage.setItem('auth-token', 'mock-token')
    } catch (error) {
      throw new Error('Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
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

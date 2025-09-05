"use client"

import { useAuth } from "@/components/auth/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * Props for the ProtectedRoute component.
 */
interface ProtectedRouteProps {
  /** The content to render if the user is authenticated. */
  children: React.ReactNode
  /** An optional fallback component to show while loading or if the user is not authenticated. */
  fallback?: React.ReactNode
}

/**
 * A client-side component that protects a route from unauthenticated access.
 * It checks the user's authentication status from `useAuth`.
 * If the user is not authenticated, it redirects them to the `/login` page.
 *
 * @param {ProtectedRouteProps} props - The component props.
 */
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page if authentication is not loading and user is not logged in.
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return fallback || (
      // Default loading state indicator.
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return fallback || (
      // Default component to show while redirecting.
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

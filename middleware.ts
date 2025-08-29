import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = ['/polls/create', '/profile', '/my-polls']

// Define auth routes that should redirect if user is already logged in
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if user has auth token (from localStorage fallback)
  // For now, we'll allow all routes since we're using localStorage fallback
  // When Supabase is configured, this will be replaced with proper session checking
  
  // Redirect to login if accessing protected route without authentication
  // This is handled client-side by the ProtectedRoute component
  // For now, we'll allow all routes to avoid blocking during development
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

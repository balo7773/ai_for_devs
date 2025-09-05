"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useAuth } from "@/components/auth/AuthProvider"

/**
 * Renders the main navigation bar for the application.
 * It displays navigation links and user authentication status.
 * If a user is logged in, it shows a user menu with options to view profile,
 * manage polls, and sign out. Otherwise, it shows sign-in and sign-up buttons.
 */
export function Navigation() {
  const { user, signOut } = useAuth()

  /**
   * Handles the user sign-out process.
   */
  const handleSignOut = async () => {
    await signOut()
  }

  /**
   * Generates user initials from their name or email for the avatar fallback.
   * @param {any} user - The user object from Supabase Auth.
   * @returns {string} The user's initials.
   */
  const getUserInitials = (user: any) => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    }
    return user?.email?.charAt(0).toUpperCase() || 'U'
  }

  /**
   * Gets the user's display name, falling back to their email.
   * @param {any} user - The user object from Supabase Auth.
   * @returns {string} The user's display name.
   */
  const getUserName = (user: any) => {
    return user?.user_metadata?.name || user?.email || 'User'
  }

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              AI_FOR_DEVS Polls
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/polls" className="text-gray-600 hover:text-gray-900">
                Browse Polls
              </Link>
              <Link href="/polls/create" className="text-gray-600 hover:text-gray-900">
                Create Poll
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              // User is authenticated, show the user dropdown menu.
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt={getUserName(user)} />
                      <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{getUserName(user)}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/my-polls">My Polls</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // User is not authenticated, show sign-in and sign-up buttons.
              <div className="flex space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

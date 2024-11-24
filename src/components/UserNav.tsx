'use client'

import { createBrowserClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserNav() {
  const supabase = createBrowserClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return null
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Button onClick={handleSignIn}>
          Sign In with Google
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name || ''} />
            <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem onClick={handleSignOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

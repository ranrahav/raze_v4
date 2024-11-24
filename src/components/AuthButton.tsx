'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { GoogleIcon } from '@/components/icons/GoogleIcon'
import type { User } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: 'email profile'
        }
      })
      if (error) {
        console.error('Detailed error:', error)
      }
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error.message)
        return
      }
      // Clear local state immediately
      setUser(null)
      // Reload the page to ensure clean state
      window.location.reload()
    } catch (error) {
      console.error('Error during sign out:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Button disabled className="bg-white text-black hover:bg-white/90">Loading...</Button>
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-white">
          {user.email}
        </span>
        <Button
          variant="outline"
          onClick={handleSignOut}
          disabled={loading}
        >
          {loading ? 'Signing out...' : 'Sign Out'}
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleSignIn}
      className="bg-white text-black hover:bg-white/90 flex items-center"
    >
      <GoogleIcon />
      Sign in with Google
    </Button>
  )
}

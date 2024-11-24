import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase-browser'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
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

  const signIn = async () => {
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
        console.error('Sign in error:', error)
        return false
      }
      return true
    } catch (error) {
      console.error('Error during sign in:', error)
      return false
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        return false
      }
      window.location.reload()
      return true
    } catch (error) {
      console.error('Error during sign out:', error)
      return false
    }
  }

  return {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user
  }
}

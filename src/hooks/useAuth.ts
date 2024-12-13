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
      
      // Check for return URL after successful sign in
      if (session?.user) {
        const params = new URLSearchParams(window.location.search)
        const returnTo = params.get('returnTo')
        if (returnTo) {
          // Clean up the URL
          const newUrl = window.location.pathname
          window.history.replaceState({}, '', newUrl)
          // Parse and execute the return action
          try {
            const action = JSON.parse(decodeURIComponent(returnTo))
            if (action.type === 'showForm') {
              window.dispatchEvent(new CustomEvent('returnAction', { detail: action }))
            }
          } catch (e) {
            console.error('Error parsing return action:', e)
          }
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (returnAction?: { type: string, [key: string]: any }) => {
    try {
      let redirectTo = `${window.location.origin}/auth/callback`
      
      // If we have a return action, add it to the redirect URL
      if (returnAction) {
        const returnParam = encodeURIComponent(JSON.stringify(returnAction))
        redirectTo += `?returnTo=${returnParam}`
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
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
    signOut
  }
}

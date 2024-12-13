import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBrowserClient } from '@/lib/supabase-browser'

export function useRedirectAfterAuth(userId: string | undefined) {
  const navigate = useNavigate()
  const supabase = createBrowserClient()

  useEffect(() => {
    const redirectToLastLocation = async () => {
      if (!userId) return

      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('path, current_step')
          .eq('user_id', userId)
          .maybeSingle()

        if (error) throw error

        // If we have saved progress, redirect to the last location
        if (data?.path) {
          navigate(data.path)
        } else {
          // If no saved progress, redirect to home
          navigate('/')
        }
      } catch (error) {
        console.error('Error fetching last location:', error)
        navigate('/')
      }
    }

    redirectToLastLocation()
  }, [userId, navigate])
}

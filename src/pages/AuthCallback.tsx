import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBrowserClient } from '@/lib/supabase-browser'
import { useRedirectAfterAuth } from '@/hooks/useRedirectAfterAuth'

export default function AuthCallback() {
  const navigate = useNavigate()
  const supabase = createBrowserClient()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string>()

  // Use our custom hook for redirection
  useRedirectAfterAuth(userId)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsLoading(true)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('Session error:', sessionError)
          setError(sessionError.message)
          return
        }

        if (!session) {
          // Try to parse the hash if no session
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')

          if (accessToken) {
            // Set the session with the tokens from the URL
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            })

            if (setSessionError) {
              console.error('Set session error:', setSessionError)
              setError(setSessionError.message)
              return
            }
          } else {
            console.error('No session or access token found')
            setError('Authentication failed. Please try again.')
            return
          }
        }

        // Get the user ID and let the hook handle redirection
        const { data: { user } } = await supabase.auth.getUser()
        setUserId(user?.id)
      } catch (err) {
        console.error('Auth callback error:', err)
        setError('An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    handleAuthCallback()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Authentication Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Authenticating...</h2>
          <p className="text-gray-400">Please wait while we complete the sign-in process.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Signing you in...</h2>
        <p className="text-gray-400">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  )
}

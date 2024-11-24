import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBrowserClient } from '@/lib/supabase-browser'

export default function AuthCallback() {
  const navigate = useNavigate()
  const supabase = createBrowserClient()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Detailed session error:', error)
          setError(error.message)
          return
        }
        
        if (!data.session) {
          console.error('No session found')
          setError('Authentication failed. Please try again.')
          return
        }

        // Successfully authenticated
        console.log('Authentication successful:', data.session)
        navigate('/')
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('An unexpected error occurred')
      }
    }

    handleAuthCallback()
  }, [navigate])

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Signing you in...</h2>
        <p className="text-gray-400">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  )
}

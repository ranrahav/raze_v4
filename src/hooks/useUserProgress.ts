import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase-browser'
import { useAuth } from './useAuth'
import { FormData, UserLocation, UserProgress } from '@/types/form'
import { useNavigate, useLocation } from 'react-router-dom'

export function useUserProgress() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  // Load user progress when user is authenticated
  useEffect(() => {
    const loadUserProgress = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (error && error.code !== 'PGRST116') throw error

        if (data) {
          setCurrentStep(data.current_step)
          setFormData(data.form_data)
          
          // Restore user's last location if different from current
          if (data.path && data.path !== location.pathname) {
            navigate(data.path)
          }
        }
      } catch (error) {
        console.error('Error loading user progress:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserProgress()
  }, [user, navigate, location.pathname])

  // Save user progress
  const saveProgress = async (step: number, data: FormData) => {
    if (!user) return false

    try {
      const currentLocation: UserLocation = 
        location.pathname === '/' ? 'home' :
        location.pathname === '/plan' ? 'plan' : 'form'

      // Check if a record exists for this user
      const { data: existingData, error: checkError } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (checkError) throw checkError

      const progressData = {
        current_step: step,
        form_data: data,
        location: currentLocation,
        path: location.pathname,
        updated_at: new Date().toISOString()
      }

      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('user_progress')
          .update(progressData)
          .eq('user_id', user.id)

        if (error) throw error
      } else {
        // Insert new record
        const { error } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            ...progressData
          })

        if (error) throw error
      }

      setCurrentStep(step)
      setFormData(data)
      return true
    } catch (error) {
      console.error('Error saving user progress:', error)
      return false
    }
  }

  // Save just the location without updating form data
  const saveLocation = async () => {
    if (!user) return false

    try {
      const currentLocation: UserLocation = 
        location.pathname === '/' ? 'home' :
        location.pathname === '/plan' ? 'plan' : 'form'

      const { error } = await supabase
        .from('user_progress')
        .update({
          location: currentLocation,
          path: location.pathname,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error saving location:', error)
      return false
    }
  }

  return {
    currentStep,
    formData,
    loading,
    saveProgress,
    saveLocation
  }
}

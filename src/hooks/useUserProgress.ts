import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase-browser'
import { useAuth } from './useAuth'
import { FormData } from '@/types/form'

export function useUserProgress() {
  const { user } = useAuth()
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
        }
      } catch (error) {
        console.error('Error loading user progress:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserProgress()
  }, [user])

  // Save user progress
  const saveProgress = async (step: number, data: FormData) => {
    if (!user) return false

    try {
      // Delete any existing progress first
      await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id)

      // Insert new progress
      const { error } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          current_step: step,
          form_data: data,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setCurrentStep(step)
      setFormData(data)
      return true
    } catch (error) {
      console.error('Error saving user progress:', error)
      return false
    }
  }

  return {
    currentStep,
    formData,
    loading,
    saveProgress
  }
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      [key: string]: {
        Row: {}
        Insert: {}
        Update: {}
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          current_step: number
          form_data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_step: number
          form_data: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_step?: number
          form_data?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [key: string]: {
        Row: {}
      }
    }
    Functions: {
      [key: string]: {
        Args: {}
        Returns: {}
      }
    }
    Enums: {
      [key: string]: {}
    }
  }
}

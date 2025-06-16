import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  bio?: string
  location?: string
  business_model?: string
  website?: string
  monthly_revenue: number
  total_earned: number
  verified: boolean
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  user_id: string
  name: string
  current_amount: number
  target_amount: number
  target_date: string
  priority: "High" | "Medium" | "Low"
  category: string
  description?: string
  created_at: string
  updated_at: string
}

export interface BusinessModel {
  id: string
  user_id: string
  name: string
  income_model: string
  status: "Not Started" | "In Progress" | "Systemized"
  description?: string
  type?: string
  created_at: string
  updated_at: string
  tasks?: Task[]
}

export interface Task {
  id: string
  business_model_id: string
  text: string
  completed: boolean
  created_at: string
}

export interface Habit {
  id: string
  user_id: string
  name: string
  description?: string
  category: "Health" | "Business" | "Personal" | "Learning"
  target_frequency: number
  current_streak: number
  best_streak: number
  completed_today: boolean
  completed_this_week: number
  created_at: string
  updated_at: string
}

export interface DailyPriority {
  id: string
  user_id: string
  text: string
  completed: boolean
  priority: "High" | "Medium" | "Low"
  date: string
  created_at: string
}

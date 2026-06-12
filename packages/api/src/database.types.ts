// Tipi del database — riflettono lo schema SQL in supabase/migrations.
// Manualmente allineati (in produzione generabili con `supabase gen types`).

import type { DeadlineStatus, PlanId } from '@dovuto/data'

export type SubscriptionStatus =
  | 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete'

export interface ProfileRow {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
  plan: PlanId
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface DeadlineRow {
  id: string
  user_id: string
  title: string
  subtitle: string
  category: string
  due_date: string
  amount: number
  status: DeadlineStatus
  priority: number
  notify: boolean
  created_at: string
  updated_at: string
}

export interface SubscriptionRow {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: PlanId
  status: SubscriptionStatus
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface ActivityLogRow {
  id: string
  user_id: string | null
  action: string
  detail: string | null
  created_at: string
}

// Payload per insert/update (campi gestiti dal DB esclusi)
export type DeadlineInsert = Omit<DeadlineRow, 'id' | 'created_at' | 'updated_at'>
export type DeadlineUpdate = Partial<Omit<DeadlineRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>>

export interface Database {
  public: {
    Tables: {
      profiles:      { Row: ProfileRow;      Insert: Partial<ProfileRow>;      Update: Partial<ProfileRow> }
      deadlines:     { Row: DeadlineRow;      Insert: DeadlineInsert;            Update: DeadlineUpdate }
      subscriptions: { Row: SubscriptionRow;  Insert: Partial<SubscriptionRow>;  Update: Partial<SubscriptionRow> }
      activity_logs: { Row: ActivityLogRow;   Insert: Partial<ActivityLogRow>;   Update: Partial<ActivityLogRow> }
    }
  }
}

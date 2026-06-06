// ─── CORE TYPES ──────────────────────────────────────────────────────────────

export type DeadlineStatus =
  | 'critico'
  | 'scade_oggi'
  | 'in_scadenza'
  | 'programmato'
  | 'completato'

export type CategoryId =
  | 'immobili'
  | 'finanza'
  | 'veicoli'
  | 'salute'
  | 'famiglia'
  | 'digitale'
  | 'abbonamenti'

export type PlanId = 'free' | 'personal' | 'famiglia' | 'pro'

export type UserStatus = 'active' | 'trial' | 'past_due' | 'churned'

export interface Deadline {
  id: number
  title: string
  subtitle: string
  category: CategoryId
  date: string          // ISO 8601 YYYY-MM-DD
  amount: number        // EUR, 0 = no cost
  status: DeadlineStatus
  priority: number      // 1 (highest) → 5 (lowest)
}

export interface Category {
  id: CategoryId
  label: string
  icon: string          // Lucide icon name
  color: ColorKey
  count: number
}

export interface MonthlyData {
  month: string
  amount: number
}

export interface Plan {
  id: PlanId
  name: string
  price: number         // monthly EUR
  annual: number        // annual EUR
  desc: string
  color: string
  badge?: string
  cta: string
  ctaStyle: string
  features: PlanFeature[]
}

export interface PlanFeature {
  text: string
  ok: boolean
}

export interface AdminUser {
  id: number
  name: string
  email: string
  plan: PlanId
  status: UserStatus
  joined: string
  lastSeen: string
  deadlines: number
  mrr: number
  avatar: string
}

export interface MRRDataPoint {
  month: string
  mrr: number
  users: number
}

export interface ActivityLog {
  id: number
  user: string
  action: string
  detail: string
  time: string
  type: string
}

export interface PlanDistribution {
  plan: string
  count: number
  color: string
  pct: number
}

export type ColorKey =
  | 'indigo'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'purple'
  | 'sky'
  | 'orange'
  | 'violet'
  | 'slate'

export interface StatusConfig {
  label: string
  bg: string
  text: string
  dot: string
  badge: string
  border: string
}

export interface KPI {
  label: string
  value: string | number
  trend: number
  color: string
  spark: number[]
}

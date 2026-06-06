import type { Deadline, DeadlineStatus } from './types'

export const formatCurrency = (n: number): string =>
  n === 0 ? '—' : `€${n.toLocaleString('it-IT')}`

export const formatDate = (d: string): string =>
  new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })

export const getDaysLeft = (d: string): number =>
  Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)

export const getDaysLeftLabel = (days: number): string => {
  if (days < 0)  return 'Scaduto'
  if (days === 0) return 'Oggi'
  if (days === 1) return 'Domani'
  return `fra ${days}gg`
}

export const getStatusFromDays = (days: number): DeadlineStatus => {
  if (days < 0)  return 'critico'
  if (days === 0) return 'scade_oggi'
  if (days <= 7)  return 'in_scadenza'
  return 'programmato'
}

export const isCritical = (d: Deadline): boolean =>
  ['critico', 'scade_oggi'].includes(d.status)

export const isUrgent = (d: Deadline): boolean =>
  ['critico', 'scade_oggi', 'in_scadenza'].includes(d.status)

export const sortByPriority = (deadlines: Deadline[]): Deadline[] =>
  [...deadlines].sort((a, b) => a.priority - b.priority)

export const filterByCategory = (deadlines: Deadline[], categoryId: string): Deadline[] =>
  categoryId === 'all' ? deadlines : deadlines.filter(d => d.category === categoryId)

export const getTotalAmount = (deadlines: Deadline[]): number =>
  deadlines.reduce((sum, d) => sum + d.amount, 0)

// Design system colors (native-compatible hex values)
export const COLORS = {
  primary:   '#4f46e5',  // indigo-600
  success:   '#10b981',  // emerald-500
  warning:   '#f59e0b',  // amber-500
  danger:    '#f43f5e',  // rose-500
  bg:        '#f8fafc',  // slate-50
  surface:   '#ffffff',
  text:      '#0f172a',  // slate-900
  muted:     '#64748b',  // slate-500
  border:    '#e2e8f0',  // slate-200
  indigo:    '#6366f1',
  emerald:   '#10b981',
  amber:     '#f59e0b',
  rose:      '#f43f5e',
  purple:    '#a855f7',
  sky:       '#0ea5e9',
  orange:    '#f97316',
  violet:    '#8b5cf6',
  slate:     '#64748b',
} as const

export const STATUS_COLORS_NATIVE = {
  critico:     { bg: '#fff1f2', text: '#be123c', dot: '#f43f5e' },
  scade_oggi:  { bg: '#fffbeb', text: '#b45309', dot: '#f59e0b' },
  in_scadenza: { bg: '#fff7ed', text: '#c2410c', dot: '#fb923c' },
  programmato: { bg: '#eef2ff', text: '#4338ca', dot: '#818cf8' },
  completato:  { bg: '#ecfdf5', text: '#065f46', dot: '#10b981' },
} as const

export const CAT_COLORS_NATIVE: Record<string, { bg: string; text: string; icon: string }> = {
  indigo:  { bg: '#eef2ff', text: '#4338ca', icon: '#6366f1' },
  emerald: { bg: '#ecfdf5', text: '#065f46', icon: '#10b981' },
  amber:   { bg: '#fffbeb', text: '#92400e', icon: '#f59e0b' },
  rose:    { bg: '#fff1f2', text: '#9f1239', icon: '#f43f5e' },
  purple:  { bg: '#faf5ff', text: '#6b21a8', icon: '#a855f7' },
  sky:     { bg: '#f0f9ff', text: '#0c4a6e', icon: '#0ea5e9' },
  orange:  { bg: '#fff7ed', text: '#9a3412', icon: '#f97316' },
  violet:  { bg: '#f5f3ff', text: '#4c1d95', icon: '#8b5cf6' },
  slate:   { bg: '#f8fafc', text: '#334155', icon: '#64748b' },
}

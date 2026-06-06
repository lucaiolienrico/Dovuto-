import { STATUS_CONFIG, CAT_COLORS, CATEGORIES } from '@dovuto/data'
import type { Deadline, DeadlineStatus } from '@dovuto/data'

// ─── PRESENTATION HELPERS ────────────────────────────────────────────────────
// Pure functions: take domain data, return display-ready values.
// No JSX — usable by both web and native renderers.

export interface StatusBadge {
  label: string
  // Tailwind classes (web)
  badgeClass: string
  dotClass: string
  // Hex values (native)
  bgHex: string
  textHex: string
  dotHex: string
}

const STATUS_HEX: Record<string, { bg: string; text: string; dot: string }> = {
  critico:     { bg: '#fff1f2', text: '#be123c', dot: '#f43f5e' },
  scade_oggi:  { bg: '#fffbeb', text: '#b45309', dot: '#f59e0b' },
  in_scadenza: { bg: '#fff7ed', text: '#c2410c', dot: '#fb923c' },
  programmato: { bg: '#eef2ff', text: '#4338ca', dot: '#818cf8' },
  completato:  { bg: '#ecfdf5', text: '#065f46', dot: '#10b981' },
}

export function getStatusBadge(status: DeadlineStatus): StatusBadge {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.programmato
  const hex = STATUS_HEX[status] ?? STATUS_HEX.programmato
  return {
    label: cfg.label,
    badgeClass: cfg.badge,
    dotClass: cfg.dot,
    bgHex: hex.bg,
    textHex: hex.text,
    dotHex: hex.dot,
  }
}

export function getCategoryLabel(categoryId: string): string {
  return CATEGORIES.find(c => c.id === categoryId)?.label ?? categoryId
}

export function getCategoryColorKey(categoryId: string): string {
  return CATEGORIES.find(c => c.id === categoryId)?.color ?? 'indigo'
}

// Urgency tier drives color emphasis across platforms
export type UrgencyTier = 'critical' | 'soon' | 'normal'

export function getUrgencyTier(daysLeft: number): UrgencyTier {
  if (daysLeft <= 2) return 'critical'
  if (daysLeft <= 7) return 'soon'
  return 'normal'
}

export function urgencyHex(tier: UrgencyTier): string {
  switch (tier) {
    case 'critical': return '#f43f5e'
    case 'soon':     return '#f59e0b'
    default:         return '#64748b'
  }
}

// Plan accent color resolver (shared by pricing UI)
export function planAccentHex(colorKey: string): string {
  const map: Record<string, string> = {
    slate:   '#64748b',
    indigo:  '#4f46e5',
    emerald: '#10b981',
    violet:  '#8b5cf6',
  }
  return map[colorKey] ?? '#4f46e5'
}

// Aggregate a list into a status summary (used by badges/counters)
export function summarizeByStatus(deadlines: Deadline[]): Record<DeadlineStatus, number> {
  const acc: Record<string, number> = {
    critico: 0, scade_oggi: 0, in_scadenza: 0, programmato: 0, completato: 0,
  }
  for (const d of deadlines) acc[d.status] = (acc[d.status] ?? 0) + 1
  return acc as Record<DeadlineStatus, number>
}

import { useState, useMemo } from 'react'
import {
  DEADLINES, MONTHLY_DATA,
  getDaysLeft, isUrgent, sortByPriority, filterByCategory
} from '@dovuto/data'
import type { Deadline } from '@dovuto/data'

export interface DashboardState {
  activeCategory: string
  setActiveCategory: (id: string) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
  showPricing: boolean
  setShowPricing: (v: boolean) => void
  notifOpen: boolean
  setNotifOpen: (v: boolean) => void
  criticalItems: Deadline[]
  filteredDeadlines: Deadline[]
  kpis: {
    next7: number
    next30: number
    totalMonth: number
    totalYear: number
    docScad: number
    autoRenew: number
  }
}

export function useDashboard(): DashboardState {
  const [activeCategory, setActiveCategory] = useState('all')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const criticalItems = useMemo(() =>
    sortByPriority(DEADLINES.filter(isUrgent)).slice(0, 5),
  [])

  const filteredDeadlines = useMemo(() =>
    filterByCategory(DEADLINES, activeCategory),
  [activeCategory])

  const kpis = useMemo(() => {
    const next7    = DEADLINES.filter(d => { const days = getDaysLeft(d.date); return days >= 0 && days <= 7 }).length
    const next30   = DEADLINES.filter(d => { const days = getDaysLeft(d.date); return days >= 0 && days <= 30 }).length
    const totalMonth = MONTHLY_DATA[5].amount
    const totalYear  = MONTHLY_DATA.reduce((s, m) => s + m.amount, 0)
    const docScad    = DEADLINES.filter(d => ['critico', 'scade_oggi'].includes(d.status)).length
    const autoRenew  = DEADLINES.filter(d => ['digitale', 'abbonamenti'].includes(d.category)).length
    return { next7, next30, totalMonth, totalYear, docScad, autoRenew }
  }, [])

  return {
    activeCategory, setActiveCategory,
    sidebarCollapsed, setSidebarCollapsed,
    showPricing, setShowPricing,
    notifOpen, setNotifOpen,
    criticalItems,
    filteredDeadlines,
    kpis,
  }
}

import { useState, useMemo } from 'react'
import { DEADLINES, MONTHLY_DATA, getDaysLeft } from '../data/mockData'

export function useDashboard() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const criticalItems = useMemo(() =>
    DEADLINES
      .filter(d => ['critico', 'scade_oggi', 'in_scadenza'].includes(d.status))
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 5),
  [])

  const filteredDeadlines = useMemo(() =>
    activeCategory === 'all'
      ? DEADLINES
      : DEADLINES.filter(d => d.category === activeCategory),
  [activeCategory])

  const kpis = useMemo(() => {
    const next7   = DEADLINES.filter(d => getDaysLeft(d.date) <= 7  && getDaysLeft(d.date) >= 0).length
    const next30  = DEADLINES.filter(d => getDaysLeft(d.date) <= 30 && getDaysLeft(d.date) >= 0).length
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

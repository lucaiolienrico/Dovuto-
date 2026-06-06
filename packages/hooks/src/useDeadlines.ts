import { useState, useMemo, useCallback } from 'react'
import { DEADLINES } from '@dovuto/data'
import type { Deadline, DeadlineStatus } from '@dovuto/data'

export function useDeadlines() {
  const [items, setItems] = useState<Deadline[]>(DEADLINES)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState<DeadlineStatus | 'all'>('all')

  const filtered = useMemo(() => {
    return items.filter(d => {
      const matchSearch   = !search || d.title.toLowerCase().includes(search.toLowerCase())
      const matchCategory = filterCategory === 'all' || d.category === filterCategory
      const matchStatus   = filterStatus === 'all' || d.status === filterStatus
      return matchSearch && matchCategory && matchStatus
    })
  }, [items, search, filterCategory, filterStatus])

  const add = useCallback((deadline: Omit<Deadline, 'id'>) => {
    setItems(prev => [...prev, { ...deadline, id: Date.now() }])
  }, [])

  const update = useCallback((updated: Deadline) => {
    setItems(prev => prev.map(d => d.id === updated.id ? updated : d))
  }, [])

  const remove = useCallback((id: number) => {
    setItems(prev => prev.filter(d => d.id !== id))
  }, [])

  const complete = useCallback((id: number) => {
    setItems(prev => prev.map(d => d.id === id ? { ...d, status: 'completato' as DeadlineStatus } : d))
  }, [])

  return {
    items,
    filtered,
    search, setSearch,
    filterCategory, setFilterCategory,
    filterStatus, setFilterStatus,
    add, update, remove, complete,
  }
}

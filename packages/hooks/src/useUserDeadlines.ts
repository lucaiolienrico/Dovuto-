import { useState, useEffect, useCallback } from 'react'
import { DEADLINES as MOCK_DEADLINES } from '@dovuto/data'
import type { Deadline, DeadlineStatus, CategoryId } from '@dovuto/data'
import { deadlines as deadlinesApi, type DeadlineRow } from '@dovuto/api'

// Converte una riga DB (snake_case) nel tipo Deadline dell'app (camelCase via date)
function rowToDeadline(row: DeadlineRow): Deadline {
  return {
    id: hashId(row.id),
    title: row.title,
    subtitle: row.subtitle,
    category: row.category as CategoryId,
    date: row.due_date,
    amount: Number(row.amount),
    status: row.status as DeadlineStatus,
    priority: row.priority,
  }
}

// Gli ID DB sono uuid; l'UI usa number. Manteniamo una mappa uuid↔number.
const idMap = new Map<number, string>()
function hashId(uuid: string): number {
  let h = 0
  for (let i = 0; i < uuid.length; i++) h = (Math.imul(31, h) + uuid.charCodeAt(i)) | 0
  const n = Math.abs(h)
  idMap.set(n, uuid)
  return n
}
export function resolveUuid(numericId: number): string | undefined {
  return idMap.get(numericId)
}

export interface UseUserDeadlinesResult {
  deadlines: Deadline[]
  loading: boolean
  error: string | null
  isDemo: boolean              // true se stiamo mostrando i dati mock
  refresh: () => Promise<void>
}

/**
 * Carica le scadenze dell'utente da Supabase.
 * Se userId è null (utente non loggato), mostra i dati demo mock.
 */
export function useUserDeadlines(userId: string | null): UseUserDeadlinesResult {
  const [deadlines, setDeadlines] = useState<Deadline[]>(MOCK_DEADLINES)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isDemo = userId === null

  const load = useCallback(async () => {
    if (!userId) {
      setDeadlines(MOCK_DEADLINES)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const rows = await deadlinesApi.list(userId)
      setDeadlines(rows.map(rowToDeadline))
    } catch (e) {
      setError('Impossibile caricare le scadenze')
      console.error('[useUserDeadlines]', e)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { load() }, [load])

  return { deadlines, loading, error, isDemo, refresh: load }
}

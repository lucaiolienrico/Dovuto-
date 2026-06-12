import { describe, it, expect } from 'vitest'
import {
  formatCurrency, getDaysLeftLabel, getStatusFromDays,
  isCritical, isUrgent, sortByPriority, filterByCategory, getTotalAmount,
} from './utils'
import type { Deadline } from './types'

const mk = (over: Partial<Deadline>): Deadline => ({
  id: 1, title: 'X', subtitle: '', category: 'finanza',
  date: '2024-12-31', amount: 0, status: 'programmato', priority: 3, ...over,
})

describe('formatCurrency', () => {
  it('mostra trattino per zero', () => {
    expect(formatCurrency(0)).toBe('—')
  })
  it('formatta valori in EUR con simbolo', () => {
    const out = formatCurrency(1500)
    expect(out).toContain('€')
    // Il separatore migliaia dipende dall'ICU del runtime;
    // verifichiamo che le cifre siano presenti.
    expect(out.replace(/\D/g, '')).toBe('1500')
  })
})

describe('getDaysLeftLabel', () => {
  it('gestisce passato, oggi, domani, futuro', () => {
    expect(getDaysLeftLabel(-1)).toBe('Scaduto')
    expect(getDaysLeftLabel(0)).toBe('Oggi')
    expect(getDaysLeftLabel(1)).toBe('Domani')
    expect(getDaysLeftLabel(5)).toBe('fra 5gg')
  })
})

describe('getStatusFromDays', () => {
  it('mappa i giorni allo stato corretto', () => {
    expect(getStatusFromDays(-1)).toBe('critico')
    expect(getStatusFromDays(0)).toBe('scade_oggi')
    expect(getStatusFromDays(5)).toBe('in_scadenza')
    expect(getStatusFromDays(30)).toBe('programmato')
  })
})

describe('isCritical / isUrgent', () => {
  it('isCritical solo per critico e scade_oggi', () => {
    expect(isCritical(mk({ status: 'critico' }))).toBe(true)
    expect(isCritical(mk({ status: 'scade_oggi' }))).toBe(true)
    expect(isCritical(mk({ status: 'in_scadenza' }))).toBe(false)
  })
  it('isUrgent include anche in_scadenza', () => {
    expect(isUrgent(mk({ status: 'in_scadenza' }))).toBe(true)
    expect(isUrgent(mk({ status: 'programmato' }))).toBe(false)
  })
})

describe('sortByPriority', () => {
  it('ordina dalla priorità più alta (1) alla più bassa', () => {
    const list = [mk({ id: 1, priority: 3 }), mk({ id: 2, priority: 1 }), mk({ id: 3, priority: 5 })]
    const sorted = sortByPriority(list)
    expect(sorted.map(d => d.id)).toEqual([2, 1, 3])
  })
  it('non muta l\'array originale', () => {
    const list = [mk({ id: 1, priority: 3 }), mk({ id: 2, priority: 1 })]
    sortByPriority(list)
    expect(list[0].id).toBe(1)
  })
})

describe('filterByCategory', () => {
  const list = [mk({ id: 1, category: 'finanza' }), mk({ id: 2, category: 'veicoli' })]
  it('ritorna tutto con "all"', () => {
    expect(filterByCategory(list, 'all')).toHaveLength(2)
  })
  it('filtra per categoria', () => {
    expect(filterByCategory(list, 'veicoli')).toHaveLength(1)
  })
})

describe('getTotalAmount', () => {
  it('somma gli importi', () => {
    const list = [mk({ amount: 100 }), mk({ amount: 250 }), mk({ amount: 0 })]
    expect(getTotalAmount(list)).toBe(350)
  })
})

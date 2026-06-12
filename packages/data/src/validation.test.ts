import { describe, it, expect } from 'vitest'
import {
  validateDeadline, isValidDeadline,
  validateEmail, validatePassword,
} from './validation'

describe('validateDeadline', () => {
  const valid = {
    title: 'Bollo Auto',
    date: '2024-12-31',
    amount: 187,
    category: 'veicoli' as const,
    status: 'programmato' as const,
    priority: 3,
  }

  it('accetta una scadenza valida', () => {
    expect(validateDeadline(valid)).toHaveLength(0)
    expect(isValidDeadline(valid)).toBe(true)
  })

  it('rifiuta titolo mancante', () => {
    const errs = validateDeadline({ ...valid, title: '' })
    expect(errs.some(e => e.field === 'title')).toBe(true)
  })

  it('rifiuta titolo troppo lungo', () => {
    const errs = validateDeadline({ ...valid, title: 'x'.repeat(121) })
    expect(errs.some(e => e.field === 'title')).toBe(true)
  })

  it('rifiuta data in formato errato', () => {
    const errs = validateDeadline({ ...valid, date: '31/12/2024' })
    expect(errs.some(e => e.field === 'date')).toBe(true)
  })

  it('rifiuta importo negativo', () => {
    const errs = validateDeadline({ ...valid, amount: -10 })
    expect(errs.some(e => e.field === 'amount')).toBe(true)
  })

  it('rifiuta priorità fuori range', () => {
    expect(validateDeadline({ ...valid, priority: 0 }).length).toBeGreaterThan(0)
    expect(validateDeadline({ ...valid, priority: 6 }).length).toBeGreaterThan(0)
  })

  it('rifiuta categoria non valida', () => {
    const errs = validateDeadline({ ...valid, category: 'inesistente' as any })
    expect(errs.some(e => e.field === 'category')).toBe(true)
  })
})

describe('validateEmail', () => {
  it('accetta email valide', () => {
    expect(validateEmail('test@dovuto.it')).toBeNull()
  })
  it('rifiuta email vuota', () => {
    expect(validateEmail('')?.field).toBe('email')
  })
  it('rifiuta email malformata', () => {
    expect(validateEmail('non-una-email')?.field).toBe('email')
  })
})

describe('validatePassword', () => {
  it('accetta password >= 8 caratteri', () => {
    expect(validatePassword('password1')).toBeNull()
  })
  it('rifiuta password corta', () => {
    expect(validatePassword('abc')?.field).toBe('password')
  })
  it('rifiuta password vuota', () => {
    expect(validatePassword('')?.field).toBe('password')
  })
})

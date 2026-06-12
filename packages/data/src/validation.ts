import type { Deadline, DeadlineStatus, CategoryId } from './types'

// ─── VALIDAZIONE SCADENZE ────────────────────────────────────────────────────

export interface ValidationError {
  field: string
  message: string
}

const VALID_STATUSES: DeadlineStatus[] = [
  'critico', 'scade_oggi', 'in_scadenza', 'programmato', 'completato',
]

const VALID_CATEGORIES: CategoryId[] = [
  'immobili', 'finanza', 'veicoli', 'salute', 'famiglia', 'digitale', 'abbonamenti',
]

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function validateDeadline(
  input: Partial<Deadline>,
): ValidationError[] {
  const errors: ValidationError[] = []

  // Titolo
  if (!input.title || input.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Il titolo è obbligatorio' })
  } else if (input.title.length > 120) {
    errors.push({ field: 'title', message: 'Il titolo non può superare 120 caratteri' })
  }

  // Data
  if (!input.date) {
    errors.push({ field: 'date', message: 'La data di scadenza è obbligatoria' })
  } else if (!ISO_DATE.test(input.date)) {
    errors.push({ field: 'date', message: 'Formato data non valido (YYYY-MM-DD)' })
  } else if (Number.isNaN(new Date(input.date).getTime())) {
    errors.push({ field: 'date', message: 'Data inesistente' })
  }

  // Importo
  if (input.amount !== undefined) {
    if (typeof input.amount !== 'number' || Number.isNaN(input.amount)) {
      errors.push({ field: 'amount', message: 'L\'importo deve essere un numero' })
    } else if (input.amount < 0) {
      errors.push({ field: 'amount', message: 'L\'importo non può essere negativo' })
    } else if (input.amount > 1_000_000) {
      errors.push({ field: 'amount', message: 'Importo troppo elevato' })
    }
  }

  // Categoria
  if (input.category && !VALID_CATEGORIES.includes(input.category)) {
    errors.push({ field: 'category', message: 'Categoria non valida' })
  }

  // Stato
  if (input.status && !VALID_STATUSES.includes(input.status)) {
    errors.push({ field: 'status', message: 'Stato non valido' })
  }

  // Priorità
  if (input.priority !== undefined) {
    if (!Number.isInteger(input.priority) || input.priority < 1 || input.priority > 5) {
      errors.push({ field: 'priority', message: 'La priorità deve essere tra 1 e 5' })
    }
  }

  return errors
}

export function isValidDeadline(input: Partial<Deadline>): boolean {
  return validateDeadline(input).length === 0
}

// ─── VALIDAZIONE AUTH ────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): ValidationError | null {
  if (!email || email.trim().length === 0) {
    return { field: 'email', message: 'L\'email è obbligatoria' }
  }
  if (!EMAIL_RE.test(email)) {
    return { field: 'email', message: 'Email non valida' }
  }
  return null
}

export function validatePassword(password: string): ValidationError | null {
  if (!password || password.length === 0) {
    return { field: 'password', message: 'La password è obbligatoria' }
  }
  if (password.length < 8) {
    return { field: 'password', message: 'La password deve avere almeno 8 caratteri' }
  }
  return null
}

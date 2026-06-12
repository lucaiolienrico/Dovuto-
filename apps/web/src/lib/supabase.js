import { createDovutoClient } from '@dovuto/api'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY mancanti. ' +
    'Copia apps/web/.env.example in .env.local e compila i valori.'
  )
}

// Su web il default storage è localStorage — nessun adapter necessario.
export const supabase = createDovutoClient({
  url: url ?? 'http://localhost',
  anonKey: anonKey ?? 'placeholder',
})

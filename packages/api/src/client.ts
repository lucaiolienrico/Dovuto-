import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

export type DovutoClient = SupabaseClient<Database>

export interface SupabaseConfig {
  url: string
  anonKey: string
  // Storage adapter: AsyncStorage su mobile, undefined (localStorage) su web
  storage?: {
    getItem: (key: string) => Promise<string | null>
    setItem: (key: string, value: string) => Promise<void>
    removeItem: (key: string) => Promise<void>
  }
}

let client: DovutoClient | null = null

/**
 * Crea (o restituisce) il client Supabase singleton.
 * Passare uno storage adapter su React Native; su web usa il default.
 */
export function createDovutoClient(config: SupabaseConfig): DovutoClient {
  if (client) return client

  client = createClient<Database>(config.url, config.anonKey, {
    auth: {
      ...(config.storage ? { storage: config.storage as any } : {}),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })

  return client
}

export function getClient(): DovutoClient {
  if (!client) {
    throw new Error('Supabase client non inizializzato. Chiama createDovutoClient() prima.')
  }
  return client
}

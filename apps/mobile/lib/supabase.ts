import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createDovutoClient } from '@dovuto/api'

const url = process.env.EXPO_PUBLIC_SUPABASE_URL
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.warn(
    '[Supabase] EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_ANON_KEY mancanti. ' +
    'Crea apps/mobile/.env con i valori (vedi .env.example).'
  )
}

// Su React Native serve un adapter di storage esplicito (AsyncStorage).
export const supabase = createDovutoClient({
  url: url ?? 'http://localhost',
  anonKey: anonKey ?? 'placeholder',
  storage: {
    getItem: (key) => AsyncStorage.getItem(key),
    setItem: (key, value) => AsyncStorage.setItem(key, value),
    removeItem: (key) => AsyncStorage.removeItem(key),
  },
})

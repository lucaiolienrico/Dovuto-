import { MMKV } from 'react-native-mmkv'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Deadline } from '@dovuto/data'

// ─── MMKV: fast synchronous storage for preferences ──────────────────────────

export const storage = new MMKV({ id: 'dovuto-prefs' })

export const Prefs = {
  getBool: (key: string, fallback = false): boolean => {
    const v = storage.getBoolean(key)
    return v === undefined ? fallback : v
  },
  setBool: (key: string, value: boolean): void => storage.set(key, value),

  getString: (key: string, fallback = ''): string =>
    storage.getString(key) ?? fallback,
  setString: (key: string, value: string): void => storage.set(key, value),

  getNumber: (key: string, fallback = 0): number =>
    storage.getNumber(key) ?? fallback,
  setNumber: (key: string, value: number): void => storage.set(key, value),

  delete: (key: string): void => storage.delete(key),
  clearAll: (): void => storage.clearAll(),
} as const

// Preference keys (avoid magic strings)
export const PREF_KEYS = {
  biometricsEnabled: 'biometrics_enabled',
  notificationsEnabled: 'notifications_enabled',
  weeklyDigest: 'weekly_digest',
  lastSyncTimestamp: 'last_sync_ts',
  onboardingDone: 'onboarding_done',
  theme: 'theme',
} as const

// ─── AsyncStorage: larger async cache for deadline data ──────────────────────

const CACHE_KEY = '@dovuto/deadlines_cache'

export const DeadlineCache = {
  async save(deadlines: Deadline[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(deadlines))
      Prefs.setNumber(PREF_KEYS.lastSyncTimestamp, Date.now())
    } catch (e) {
      console.error('[DeadlineCache] save failed', e)
    }
  },

  async load(): Promise<Deadline[] | null> {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY)
      if (!raw) return null
      return JSON.parse(raw) as Deadline[]
    } catch (e) {
      console.error('[DeadlineCache] load failed', e)
      return null
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEY)
    } catch (e) {
      console.error('[DeadlineCache] clear failed', e)
    }
  },

  getLastSync(): Date | null {
    const ts = Prefs.getNumber(PREF_KEYS.lastSyncTimestamp, 0)
    return ts > 0 ? new Date(ts) : null
  },
} as const

import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import { Prefs, PREF_KEYS } from './storage'

export type BiometricType = 'face' | 'fingerprint' | 'iris' | 'none'

// ─── Capability detection ────────────────────────────────────────────────────

export async function getBiometricType(): Promise<BiometricType> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync()
  if (!hasHardware) return 'none'

  const enrolled = await LocalAuthentication.isEnrolledAsync()
  if (!enrolled) return 'none'

  const types = await LocalAuthentication.supportedAuthenticationTypesAsync()

  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) return 'face'
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) return 'fingerprint'
  if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) return 'iris'
  return 'none'
}

export async function isBiometricAvailable(): Promise<boolean> {
  const type = await getBiometricType()
  return type !== 'none'
}

// ─── Authenticate ────────────────────────────────────────────────────────────

export interface BiometricResult {
  success: boolean
  error?: string
}

export async function authenticate(reason = 'Accedi a Dovuto'): Promise<BiometricResult> {
  const available = await isBiometricAvailable()
  if (!available) return { success: false, error: 'Biometria non disponibile' }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: reason,
    cancelLabel: 'Annulla',
    fallbackLabel: 'Usa PIN',
    disableDeviceFallback: false,
  })

  if (result.success) return { success: true }
  return { success: false, error: result.error ?? 'Autenticazione fallita' }
}

// ─── Enable / disable biometric lock ─────────────────────────────────────────

export async function enableBiometrics(): Promise<BiometricResult> {
  const result = await authenticate('Conferma per attivare lo sblocco biometrico')
  if (result.success) {
    Prefs.setBool(PREF_KEYS.biometricsEnabled, true)
  }
  return result
}

export function disableBiometrics(): void {
  Prefs.setBool(PREF_KEYS.biometricsEnabled, false)
}

export function isBiometricsEnabled(): boolean {
  return Prefs.getBool(PREF_KEYS.biometricsEnabled, false)
}

// ─── Secure credential storage (SecureStore = Keychain/Keystore) ─────────────

const TOKEN_KEY = 'dovuto_auth_token'

export const SecureCredentials = {
  async saveToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    })
  },

  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY)
  },

  async clearToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY)
  },
} as const

// ─── Convenience label for UI ────────────────────────────────────────────────

export function biometricLabel(type: BiometricType): string {
  switch (type) {
    case 'face': return 'Face ID'
    case 'fingerprint': return 'Impronta digitale'
    case 'iris': return 'Scansione iride'
    default: return 'Biometria'
  }
}

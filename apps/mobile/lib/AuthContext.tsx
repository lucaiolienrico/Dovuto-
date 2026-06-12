import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { auth as authApi, profiles, type ProfileRow } from '@dovuto/api'
import './supabase' // inizializza il client singleton con AsyncStorage

interface AuthState {
  user: { id: string; email: string } | null
  profile: ProfileRow | null
  loading: boolean
  isAdmin: boolean
  plan: string
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthState['user']>(null)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authApi.getSession().then(async ({ data }) => {
      const u = data?.session?.user
      if (u) {
        setUser({ id: u.id, email: u.email ?? '' })
        setProfile(await profiles.get(u.id))
      }
      setLoading(false)
    })

    const { data: sub } = authApi.onAuthStateChange(async (_event, session: any) => {
      const u = session?.user
      if (u) {
        setUser({ id: u.id, email: u.email ?? '' })
        setProfile(await profiles.get(u.id))
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => sub?.subscription?.unsubscribe?.()
  }, [])

  const value: AuthState = {
    user,
    profile,
    loading,
    isAdmin: profile?.is_admin ?? false,
    plan: profile?.plan ?? 'free',
    async signIn(email, password) {
      const { error } = await authApi.signIn(email, password)
      return { error: error?.message ?? null }
    },
    async signUp(email, password, fullName) {
      const { error } = await authApi.signUp(email, password, fullName)
      return { error: error?.message ?? null }
    },
    async signOut() {
      await authApi.signOut()
      setUser(null)
      setProfile(null)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve essere dentro AuthProvider')
  return ctx
}

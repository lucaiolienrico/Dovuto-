import { createContext, useContext, useEffect, useState } from 'react'
import { auth as authApi, profiles } from '@dovuto/api'
import '../lib/supabase' // inizializza il client singleton

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Sessione iniziale
    authApi.getSession().then(async ({ data }) => {
      const u = data?.session?.user ?? null
      setUser(u)
      if (u) setProfile(await profiles.get(u.id))
      setLoading(false)
    })

    // Ascolta i cambi di stato auth
    const { data: sub } = authApi.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      setProfile(u ? await profiles.get(u.id) : null)
    })

    return () => sub?.subscription?.unsubscribe?.()
  }, [])

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.is_admin ?? false,
    plan: profile?.plan ?? 'free',
    async signIn(email, password) {
      const { error } = await authApi.signIn(email, password)
      return { error }
    },
    async signUp(email, password, fullName) {
      const { error } = await authApi.signUp(email, password, fullName)
      return { error }
    },
    async signOut() {
      await authApi.signOut()
      setUser(null)
      setProfile(null)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve essere usato dentro AuthProvider')
  return ctx
}

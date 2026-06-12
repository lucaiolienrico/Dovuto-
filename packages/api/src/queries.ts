import { getClient } from './client'
import type {
  DeadlineRow, DeadlineInsert, DeadlineUpdate,
  ProfileRow, SubscriptionRow, ActivityLogRow,
} from './database.types'

// ─── AUTH ────────────────────────────────────────────────────────────────────

export const auth = {
  async signUp(email: string, password: string, fullName: string) {
    const supabase = getClient()
    return supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
  },

  async signIn(email: string, password: string) {
    return getClient().auth.signInWithPassword({ email, password })
  },

  async signOut() {
    return getClient().auth.signOut()
  },

  async getSession() {
    return getClient().auth.getSession()
  },

  async getUser() {
    return getClient().auth.getUser()
  },

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return getClient().auth.onAuthStateChange(callback)
  },
}

// ─── PROFILE ─────────────────────────────────────────────────────────────────

export const profiles = {
  async get(userId: string): Promise<ProfileRow | null> {
    const { data, error } = await getClient()
      .from('profiles').select('*').eq('id', userId).single()
    if (error) { console.error('[profiles.get]', error.message); return null }
    return data
  },

  async update(userId: string, patch: Partial<ProfileRow>): Promise<ProfileRow | null> {
    const { data, error } = await getClient()
      .from('profiles').update(patch).eq('id', userId).select().single()
    if (error) { console.error('[profiles.update]', error.message); return null }
    return data
  },
}

// ─── DEADLINES (CRUD) ────────────────────────────────────────────────────────

export const deadlines = {
  async list(userId: string): Promise<DeadlineRow[]> {
    const { data, error } = await getClient()
      .from('deadlines').select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true })
    if (error) { console.error('[deadlines.list]', error.message); return [] }
    return data ?? []
  },

  async get(id: string): Promise<DeadlineRow | null> {
    const { data, error } = await getClient()
      .from('deadlines').select('*').eq('id', id).single()
    if (error) { console.error('[deadlines.get]', error.message); return null }
    return data
  },

  async create(payload: DeadlineInsert): Promise<DeadlineRow | null> {
    const { data, error } = await getClient()
      .from('deadlines').insert(payload).select().single()
    if (error) { console.error('[deadlines.create]', error.message); return null }
    return data
  },

  async update(id: string, patch: DeadlineUpdate): Promise<DeadlineRow | null> {
    const { data, error } = await getClient()
      .from('deadlines').update(patch).eq('id', id).select().single()
    if (error) { console.error('[deadlines.update]', error.message); return null }
    return data
  },

  async remove(id: string): Promise<boolean> {
    const { error } = await getClient().from('deadlines').delete().eq('id', id)
    if (error) { console.error('[deadlines.remove]', error.message); return false }
    return true
  },

  async complete(id: string): Promise<DeadlineRow | null> {
    return this.update(id, { status: 'completato' })
  },
}

// ─── SUBSCRIPTIONS ───────────────────────────────────────────────────────────

export const subscriptions = {
  async getForUser(userId: string): Promise<SubscriptionRow | null> {
    const { data, error } = await getClient()
      .from('subscriptions').select('*').eq('user_id', userId).single()
    if (error) { console.error('[subscriptions.get]', error.message); return null }
    return data
  },
}

// ─── ACTIVITY ────────────────────────────────────────────────────────────────

export const activity = {
  async log(userId: string, action: string, detail?: string): Promise<void> {
    const { error } = await getClient()
      .from('activity_logs').insert({ user_id: userId, action, detail: detail ?? null })
    if (error) console.error('[activity.log]', error.message)
  },

  async recent(limit = 20): Promise<ActivityLogRow[]> {
    const { data, error } = await getClient()
      .from('activity_logs').select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) { console.error('[activity.recent]', error.message); return [] }
    return data ?? []
  },
}

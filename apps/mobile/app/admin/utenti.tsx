import { useState, useMemo } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { ChevronLeft, Search, Users } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { MOCK_USERS } from '@dovuto/data'
import type { AdminUser, PlanId, UserStatus } from '@dovuto/data'

const PLAN_STYLE: Record<PlanId, { bg: string; text: string; label: string }> = {
  free:     { bg: 'rgba(148,163,184,0.15)', text: '#94a3b8', label: 'Free'     },
  personal: { bg: 'rgba(99,102,241,0.15)',  text: '#818cf8', label: 'Personal' },
  famiglia: { bg: 'rgba(16,185,129,0.15)',  text: '#34d399', label: 'Famiglia' },
  pro:      { bg: 'rgba(139,92,246,0.15)',  text: '#a78bfa', label: 'Pro'      },
}

const STATUS_STYLE: Record<UserStatus, { dot: string; text: string; label: string }> = {
  active:   { dot: '#10b981', text: '#34d399', label: 'Attivo'    },
  trial:    { dot: '#f59e0b', text: '#fbbf24', label: 'Trial'     },
  past_due: { dot: '#f43f5e', text: '#fb7185', label: 'Pagamento' },
  churned:  { dot: '#64748b', text: '#94a3b8', label: 'Churned'   },
}

const FILTERS: { id: 'all' | UserStatus; label: string }[] = [
  { id: 'all',      label: 'Tutti'    },
  { id: 'active',   label: 'Attivi'   },
  { id: 'trial',    label: 'Trial'    },
  { id: 'past_due', label: 'Pagamento'},
  { id: 'churned',  label: 'Churned'  },
]

function UserRow({ user }: { user: AdminUser }) {
  const ps = PLAN_STYLE[user.plan]
  const ss = STATUS_STYLE[user.status]
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.avatar}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
        <Text style={styles.email} numberOfLines={1}>{user.email}</Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <View style={[styles.planBadge, { backgroundColor: ps.bg }]}>
          <Text style={[styles.planText, { color: ps.text }]}>{ps.label}</Text>
        </View>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: ss.dot }]} />
          <Text style={[styles.statusText, { color: ss.text }]}>{ss.label}</Text>
        </View>
      </View>
      {user.mrr > 0 && (
        <Text style={styles.mrr}>€{user.mrr}</Text>
      )}
    </View>
  )
}

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | UserStatus>('all')

  const filtered = useMemo(() => {
    return MOCK_USERS.filter(u => {
      const matchSearch = !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      const matchStatus = filter === 'all' || u.status === filter
      return matchSearch && matchStatus
    })
  }, [search, filter])

  const totalMRR = filtered.filter(u => u.status === 'active').reduce((s, u) => s + u.mrr, 0)

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} accessibilityLabel="Indietro">
          <ChevronLeft size={22} color="#e2e8f0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Utenti</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Stats line */}
      <View style={styles.statsLine}>
        <Text style={styles.statsText}>{filtered.length} utenti · MRR €{totalMRR.toFixed(2)}</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Search size={14} color="#64748b" style={{ position: 'absolute', left: 12, top: 13, zIndex: 1 }} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Cerca nome o email..."
          placeholderTextColor="#475569"
          style={styles.searchInput}
          accessibilityLabel="Cerca utenti"
        />
      </View>

      {/* Filter chips */}
      <View style={{ height: 44 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {FILTERS.map(f => {
            const active = filter === f.id
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setFilter(f.id) }}
                style={[styles.chip, active && styles.chipActive]}
                accessibilityLabel={`Filtra ${f.label}`}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {/* List */}
      <FlashList
        data={filtered}
        estimatedItemSize={72}
        renderItem={({ item }) => <UserRow user={item} />}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Users size={36} color="#334155" />
            <Text style={styles.emptyText}>Nessun utente trovato</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#0f172a', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  headerTitle: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#e2e8f0' },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  statsLine: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  statsText: { fontFamily: 'DMSans_500Medium', fontSize: 12, color: '#64748b' },
  searchWrap: { marginHorizontal: 16, marginVertical: 10, position: 'relative' },
  searchInput: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 12, paddingLeft: 36, paddingRight: 12, paddingVertical: 11, fontFamily: 'DMSans_400Regular', fontSize: 14, color: '#fff' },
  chip: { height: 32, borderRadius: 20, paddingHorizontal: 14, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  chipText: { fontFamily: 'DMSans_600SemiBold', fontSize: 12, color: '#64748b' },
  chipTextActive: { color: '#fff' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#0f172a', marginHorizontal: 16, marginBottom: 8, borderRadius: 14, borderWidth: 1, borderColor: '#1e293b', paddingHorizontal: 14, paddingVertical: 12 },
  avatar: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(99,102,241,0.15)', borderWidth: 1, borderColor: 'rgba(99,102,241,0.2)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'DMSans_700Bold', fontSize: 12, color: '#818cf8' },
  name: { fontFamily: 'DMSans_600SemiBold', fontSize: 13, color: '#e2e8f0' },
  email: { fontFamily: 'DMSans_400Regular', fontSize: 11, color: '#64748b', marginTop: 1 },
  planBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  planText: { fontFamily: 'DMSans_700Bold', fontSize: 9 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: 'DMSans_500Medium', fontSize: 10 },
  mrr: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: '#34d399', marginLeft: 4 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontFamily: 'DMSans_500Medium', fontSize: 14, color: '#64748b' },
})

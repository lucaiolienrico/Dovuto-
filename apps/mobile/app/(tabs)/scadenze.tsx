import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import { Search, Filter, FileText, MoreHorizontal } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import { useDeadlines } from '@dovuto/hooks'
import {
  CATEGORIES, STATUS_CONFIG,
  formatCurrency, formatDate, getDaysLeft,
  COLORS, STATUS_COLORS_NATIVE, CAT_COLORS_NATIVE
} from '@dovuto/data'
import type { Deadline } from '@dovuto/data'

function DeadlineRow({ item }: { item: Deadline }) {
  const sc  = STATUS_COLORS_NATIVE[item.status] || STATUS_COLORS_NATIVE.programmato
  const cat = CATEGORIES.find(c => c.id === item.category)
  const cc  = cat ? CAT_COLORS_NATIVE[cat.color] : CAT_COLORS_NATIVE.indigo
  const days = getDaysLeft(item.date)

  return (
    <TouchableOpacity
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/deadline/${item.id}`) }}
      style={styles.row}
      accessibilityLabel={`${item.title}, ${item.subtitle}`}
    >
      <View style={{ position: 'relative' }}>
        <View style={[styles.categoryIcon, { backgroundColor: cc.bg }]}>
          <FileText size={17} color={cc.icon} />
        </View>
        <View style={[styles.statusDot, { backgroundColor: sc.dot }]} />
      </View>

      <View style={{ flex: 1, minWidth: 0, marginLeft: 12 }}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>
      </View>

      <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
        <Text style={[styles.daysLeft, { color: days <= 3 ? COLORS.danger : days <= 14 ? COLORS.warning : COLORS.muted }]}>
          {days <= 0 ? 'Scaduto' : `fra ${days}gg`}
        </Text>
      </View>

      {item.amount > 0 && (
        <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
      )}

      <View style={[styles.badge, { backgroundColor: sc.bg }]}>
        <Text style={[styles.badgeText, { color: sc.text }]}>{STATUS_CONFIG[item.status]?.label}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default function ScadenzeScreen() {
  const { filtered, search, setSearch, filterCategory, setFilterCategory } = useDeadlines()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Scadenze</Text>
        <Text style={styles.screenSubtitle}>{filtered.length} elementi</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={14} color={COLORS.muted} style={{ position: 'absolute', left: 12, top: 13, zIndex: 1 }} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Cerca scadenze..."
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
          accessibilityLabel="Cerca scadenze"
        />
      </View>

      {/* Category filter chips */}
      <View style={{ height: 44 }}>
        <FlashList
          data={[{ id: 'all', label: 'Tutte', color: 'indigo' }, ...CATEGORIES]}
          horizontal
          estimatedItemSize={80}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => {
            const active = filterCategory === item.id
            return (
              <TouchableOpacity
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setFilterCategory(item.id) }}
                style={[styles.chip, active && styles.chipActive]}
                accessibilityLabel={`Filtra per ${item.label}`}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )
          }}
          keyExtractor={item => item.id}
        />
      </View>

      {/* List */}
      <FlashList
        data={filtered}
        estimatedItemSize={70}
        renderItem={({ item }) => <DeadlineRow item={item} />}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
            <Filter size={40} color="#cbd5e1" />
            <Text style={{ fontFamily: 'DMSans_500Medium', fontSize: 14, color: COLORS.muted, marginTop: 12 }}>
              Nessuna scadenza trovata
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  screenTitle: { fontFamily: 'DMSans_800ExtraBold', fontSize: 22, color: '#0f172a' },
  screenSubtitle: { fontFamily: 'DMSans_400Regular', fontSize: 13, color: '#64748b', marginTop: 2 },
  searchContainer: { marginHorizontal: 16, marginBottom: 10, position: 'relative' },
  searchInput: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 12, paddingLeft: 36, paddingRight: 12, paddingVertical: 11,
    fontFamily: 'DMSans_400Regular', fontSize: 14, color: '#0f172a',
  },
  chip: {
    height: 32, borderRadius: 20, paddingHorizontal: 14, marginRight: 8,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0',
    alignItems: 'center', justifyContent: 'center',
  },
  chipActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  chipText: { fontFamily: 'DMSans_600SemiBold', fontSize: 12, color: '#64748b' },
  chipTextActive: { color: '#fff' },
  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#f8fafc',
  },
  categoryIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statusDot: { position: 'absolute', bottom: -2, right: -2, width: 11, height: 11, borderRadius: 6, borderWidth: 2, borderColor: '#fff' },
  title: { fontFamily: 'DMSans_600SemiBold', fontSize: 13, color: '#0f172a' },
  subtitle: { fontFamily: 'DMSans_400Regular', fontSize: 11, color: '#64748b', marginTop: 1 },
  date: { fontFamily: 'DMSans_700Bold', fontSize: 11, color: '#334155' },
  daysLeft: { fontFamily: 'DMSans_500Medium', fontSize: 10, marginTop: 2 },
  amount: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: '#0f172a', marginLeft: 8 },
  badge: { marginLeft: 8, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  badgeText: { fontFamily: 'DMSans_700Bold', fontSize: 9 },
})

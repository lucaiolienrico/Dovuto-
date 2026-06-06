import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import {
  ChevronLeft, Check, Pencil, Trash2, Calendar, Tag,
  Euro, AlertTriangle, Clock, Bell
} from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { DEADLINES, CATEGORIES, STATUS_CONFIG, formatCurrency, getDaysLeft, getDaysLeftLabel, COLORS, STATUS_COLORS_NATIVE, CAT_COLORS_NATIVE } from '@dovuto/data'

export default function DeadlineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const deadline = DEADLINES.find(d => d.id === Number(id))

  if (!deadline) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <AlertTriangle size={40} color="#cbd5e1" />
          <Text style={styles.notFoundText}>Scadenza non trovata</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>Torna indietro</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const sc   = STATUS_COLORS_NATIVE[deadline.status] || STATUS_COLORS_NATIVE.programmato
  const cat  = CATEGORIES.find(c => c.id === deadline.category)
  const cc   = cat ? CAT_COLORS_NATIVE[cat.color] : CAT_COLORS_NATIVE.indigo
  const days = getDaysLeft(deadline.date)
  const fullDate = new Date(deadline.date).toLocaleDateString('it-IT', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    Alert.alert('Completata', `"${deadline.title}" segnata come completata`)
    router.back()
  }

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    Alert.alert(
      'Elimina scadenza',
      `Vuoi eliminare "${deadline.title}"? L'azione è irreversibile.`,
      [
        { text: 'Annulla', style: 'cancel' },
        { text: 'Elimina', style: 'destructive', onPress: () => router.back() },
      ],
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} accessibilityLabel="Indietro">
          <ChevronLeft size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dettaglio</Text>
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/modal/nuova-scadenza') }}
          style={styles.iconBtn}
          accessibilityLabel="Modifica"
        >
          <Pencil size={18} color={COLORS.muted} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: cc.bg }]}>
            <Tag size={26} color={cc.icon} />
          </View>
          <Text style={styles.heroTitle}>{deadline.title}</Text>
          <Text style={styles.heroSubtitle}>{deadline.subtitle}</Text>
          <View style={[styles.statusPill, { backgroundColor: sc.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: sc.dot }]} />
            <Text style={[styles.statusPillText, { color: sc.text }]}>
              {STATUS_CONFIG[deadline.status]?.label}
            </Text>
          </View>
        </View>

        {/* Countdown banner */}
        <View style={[styles.countdown, { backgroundColor: days <= 2 ? '#fff1f2' : days <= 7 ? '#fffbeb' : '#eef2ff' }]}>
          <Clock size={18} color={days <= 2 ? COLORS.danger : days <= 7 ? COLORS.warning : COLORS.primary} />
          <Text style={[styles.countdownText, { color: days <= 2 ? COLORS.danger : days <= 7 ? COLORS.warning : COLORS.primary }]}>
            {days < 0 ? `Scaduta da ${Math.abs(days)} giorni` : getDaysLeftLabel(days)}
          </Text>
        </View>

        {/* Detail rows */}
        <View style={styles.card}>
          <DetailRow icon={Calendar} label="Data scadenza" value={fullDate} />
          <DetailRow icon={Tag} label="Categoria" value={cat?.label ?? deadline.category} />
          <DetailRow icon={Euro} label="Importo" value={formatCurrency(deadline.amount)} last={deadline.amount === 0} />
          {deadline.amount > 0 && (
            <DetailRow icon={Bell} label="Promemoria" value="30, 7 e 0 giorni prima" last />
          )}
        </View>

        {/* Priority */}
        <View style={styles.card}>
          <View style={styles.priorityRow}>
            <Text style={styles.priorityLabel}>Priorità</Text>
            <View style={styles.priorityDots}>
              {[1, 2, 3, 4, 5].map(p => (
                <View
                  key={p}
                  style={[styles.priorityDot, { backgroundColor: p <= deadline.priority ? COLORS.primary : '#e2e8f0' }]}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn} accessibilityLabel="Elimina scadenza">
          <Trash2 size={18} color={COLORS.danger} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleComplete} style={styles.completeBtn} accessibilityLabel="Segna come completata">
          <Check size={18} color="#fff" />
          <Text style={styles.completeBtnText}>Segna completata</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

function DetailRow({ icon: Icon, label, value, last = false }: {
  icon: any; label: string; value: string; last?: boolean
}) {
  return (
    <View style={[styles.detailRow, !last && styles.detailRowBorder]}>
      <View style={styles.detailIcon}>
        <Icon size={16} color={COLORS.muted} />
      </View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={2}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerTitle: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#0f172a' },
  iconBtn: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  hero: { alignItems: 'center', paddingVertical: 20 },
  heroIcon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  heroTitle: { fontFamily: 'DMSans_800ExtraBold', fontSize: 22, color: '#0f172a', textAlign: 'center' },
  heroSubtitle: { fontFamily: 'DMSans_400Regular', fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 4, paddingHorizontal: 20 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusPillText: { fontFamily: 'DMSans_700Bold', fontSize: 12 },
  countdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 16, marginBottom: 16 },
  countdownText: { fontFamily: 'DMSans_700Bold', fontSize: 15 },
  card: { backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  detailRowBorder: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  detailIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  detailLabel: { fontFamily: 'DMSans_500Medium', fontSize: 13, color: '#64748b', flex: 1 },
  detailValue: { fontFamily: 'DMSans_600SemiBold', fontSize: 13, color: '#0f172a', maxWidth: '55%', textAlign: 'right' },
  priorityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  priorityLabel: { fontFamily: 'DMSans_500Medium', fontSize: 13, color: '#64748b' },
  priorityDots: { flexDirection: 'row', gap: 5 },
  priorityDot: { width: 10, height: 10, borderRadius: 5 },
  actionBar: { flexDirection: 'row', gap: 12, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  deleteBtn: { width: 52, height: 52, borderRadius: 14, borderWidth: 1, borderColor: '#fecdd3', alignItems: 'center', justifyContent: 'center' },
  completeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#10b981', borderRadius: 14 },
  completeBtnText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#fff' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontFamily: 'DMSans_500Medium', fontSize: 15, color: '#64748b' },
  backLink: { marginTop: 8 },
  backLinkText: { fontFamily: 'DMSans_600SemiBold', fontSize: 14, color: '#4f46e5' },
})

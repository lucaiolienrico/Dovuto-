import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import {
  ChevronLeft, Users, TrendingUp, DollarSign, RefreshCw, CheckCircle,
  ArrowUpRight, ArrowDownRight, ChevronRight, UserPlus, AlertTriangle, XCircle, Activity
} from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { MOCK_USERS, MRR_DATA, ACTIVITY_LOGS, COLORS } from '@dovuto/data'

const LOG_STYLE: Record<string, { color: string; bg: string; icon: any }> = {
  signup:         { color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: UserPlus },
  upgrade:        { color: '#6366f1', bg: 'rgba(99,102,241,0.1)', icon: TrendingUp },
  payment_failed: { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', icon: AlertTriangle },
  churn:          { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', icon: XCircle },
  deadline_add:   { color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', icon: CheckCircle },
  login:          { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', icon: Activity },
  export:         { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', icon: ArrowUpRight },
}

export default function AdminDashboard() {
  const totalMRR    = MRR_DATA[MRR_DATA.length - 1].mrr
  const prevMRR     = MRR_DATA[MRR_DATA.length - 2].mrr
  const mrrGrowth   = Math.round(((totalMRR - prevMRR) / prevMRR) * 100)
  const totalUsers  = MOCK_USERS.length
  const activeUsers = MOCK_USERS.filter(u => u.status === 'active').length
  const churnRate   = Math.round((MOCK_USERS.filter(u => u.status === 'churned').length / totalUsers) * 100)
  const arr         = totalMRR * 12
  const maxMrr      = Math.max(...MRR_DATA.map(d => d.mrr))

  const kpis = [
    { label: 'MRR',      value: `€${totalMRR}`, icon: DollarSign,  trend: mrrGrowth, color: '#10b981' },
    { label: 'ARR',      value: `€${arr.toLocaleString('it-IT')}`, icon: TrendingUp, trend: mrrGrowth, color: '#6366f1' },
    { label: 'Utenti',   value: totalUsers,     icon: Users,       trend: 9,         color: '#8b5cf6' },
    { label: 'Churn',    value: `${churnRate}%`,icon: RefreshCw,   trend: -2,        color: '#f59e0b' },
  ]

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.replace('/')} style={styles.iconBtn} accessibilityLabel="Esci dall'admin">
          <ChevronLeft size={22} color="#e2e8f0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin · Overview</Text>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {/* KPI grid */}
        <View style={styles.kpiGrid}>
          {kpis.map((k, i) => {
            const Icon = k.icon
            const positive = k.trend > 0
            return (
              <View key={i} style={styles.kpiCard}>
                <View style={styles.kpiTop}>
                  <View style={[styles.kpiIcon, { backgroundColor: `${k.color}1a` }]}>
                    <Icon size={15} color={k.color} />
                  </View>
                  <View style={styles.kpiTrend}>
                    {positive ? <ArrowUpRight size={11} color="#10b981" /> : <ArrowDownRight size={11} color="#f43f5e" />}
                    <Text style={[styles.kpiTrendText, { color: positive ? '#10b981' : '#f43f5e' }]}>
                      {Math.abs(k.trend)}%
                    </Text>
                  </View>
                </View>
                <Text style={styles.kpiValue}>{k.value}</Text>
                <Text style={styles.kpiLabel}>{k.label}</Text>
              </View>
            )
          })}
        </View>

        {/* MRR chart */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Crescita MRR</Text>
              <Text style={styles.cardSubtitle}>Gennaio — Giugno 2024</Text>
            </View>
            <View style={styles.cardTrend}>
              <ArrowUpRight size={12} color="#10b981" />
              <Text style={styles.cardTrendText}>+{mrrGrowth}%</Text>
            </View>
          </View>
          <View style={styles.chart}>
            {MRR_DATA.map((d, i) => {
              const h = Math.max((d.mrr / maxMrr) * 90, 6)
              const active = i === MRR_DATA.length - 1
              return (
                <View key={i} style={styles.chartCol}>
                  <View style={[styles.chartBar, { height: h, backgroundColor: active ? '#6366f1' : '#334155' }]} />
                  <Text style={[styles.chartLabel, { color: active ? '#818cf8' : '#475569' }]}>{d.month}</Text>
                </View>
              )
            })}
          </View>
        </View>

        {/* Users link */}
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/admin/utenti') }}
          style={styles.linkCard}
          accessibilityLabel="Gestione utenti"
        >
          <View style={[styles.kpiIcon, { backgroundColor: 'rgba(99,102,241,0.15)' }]}>
            <Users size={16} color="#818cf8" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.linkTitle}>Gestione Utenti</Text>
            <Text style={styles.linkSubtitle}>{activeUsers} attivi · {totalUsers} totali</Text>
          </View>
          <ChevronRight size={18} color="#475569" />
        </TouchableOpacity>

        {/* Activity */}
        <Text style={styles.sectionLabel}>ATTIVITÀ RECENTE</Text>
        <View style={styles.card}>
          {ACTIVITY_LOGS.slice(0, 6).map((log, i) => {
            const st = LOG_STYLE[log.action] ?? LOG_STYLE.login
            const Icon = st.icon
            return (
              <View key={log.id} style={[styles.logRow, i < 5 && styles.logBorder]}>
                <View style={[styles.logIcon, { backgroundColor: st.bg }]}>
                  <Icon size={13} color={st.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.logHead}>
                    <Text style={styles.logUser}>{log.user}</Text>
                    <Text style={styles.logTime}>{log.time}</Text>
                  </View>
                  <Text style={styles.logDetail} numberOfLines={1}>{log.detail}</Text>
                </View>
              </View>
            )
          })}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#0f172a', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  headerTitle: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#e2e8f0' },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(16,185,129,0.1)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' },
  liveText: { fontFamily: 'DMSans_600SemiBold', fontSize: 11, color: '#10b981' },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpiCard: { width: '47.5%', backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 16, padding: 14 },
  kpiTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  kpiIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  kpiTrend: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  kpiTrendText: { fontFamily: 'DMSans_700Bold', fontSize: 11 },
  kpiValue: { fontFamily: 'DMSans_800ExtraBold', fontSize: 22, color: '#fff' },
  kpiLabel: { fontFamily: 'DMSans_500Medium', fontSize: 11, color: '#64748b', marginTop: 2 },
  card: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 16, padding: 16, marginTop: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  cardTitle: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: '#fff' },
  cardSubtitle: { fontFamily: 'DMSans_400Regular', fontSize: 11, color: '#64748b', marginTop: 1 },
  cardTrend: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cardTrendText: { fontFamily: 'DMSans_700Bold', fontSize: 12, color: '#10b981' },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 110, gap: 8 },
  chartCol: { flex: 1, alignItems: 'center', gap: 6 },
  chartBar: { width: '100%', borderRadius: 6 },
  chartLabel: { fontFamily: 'DMSans_500Medium', fontSize: 10 },
  linkCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 16, padding: 16, marginTop: 12 },
  linkTitle: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: '#fff' },
  linkSubtitle: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: '#64748b', marginTop: 1 },
  sectionLabel: { fontFamily: 'DMSans_600SemiBold', fontSize: 11, color: '#475569', letterSpacing: 1, marginTop: 22, marginBottom: 8, marginLeft: 4 },
  logRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 12 },
  logBorder: { borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  logIcon: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  logHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logUser: { fontFamily: 'DMSans_600SemiBold', fontSize: 13, color: '#e2e8f0' },
  logTime: { fontFamily: 'DMSans_400Regular', fontSize: 11, color: '#475569' },
  logDetail: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: '#64748b', marginTop: 1 },
})

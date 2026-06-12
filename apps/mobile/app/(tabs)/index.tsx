import { ScrollView, View, Text, TouchableOpacity, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bell, AlertTriangle, Clock, DollarSign, BarChart2, FileText, RefreshCw, ArrowUpRight, ChevronRight } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import { useDashboard, useUserDeadlines } from '@dovuto/hooks'
import { useAuth } from '../../lib/AuthContext'
import {
  CATEGORIES, STATUS_CONFIG, CAT_COLORS,
  formatCurrency, formatDate, getDaysLeft,
  COLORS, STATUS_COLORS_NATIVE, CAT_COLORS_NATIVE
} from '@dovuto/data'

function KPICard({ label, value, icon: Icon, trend, color }: {
  label: string; value: string | number; icon: any; trend: number; color: string
}) {
  const bg = `${color}15`
  return (
    <View className="bg-white rounded-2xl p-4 flex-1 mx-1.5" style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>
      <View className="flex-row items-center justify-between mb-3">
        <View style={{ backgroundColor: bg, width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color={color} />
        </View>
        {trend !== 0 && (
          <View className="flex-row items-center">
            <ArrowUpRight size={10} color={trend > 0 ? COLORS.danger : COLORS.success} />
            <Text style={{ fontSize: 10, fontFamily: 'DMSans_700Bold', color: trend > 0 ? COLORS.danger : COLORS.success }}>
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
      <Text style={{ fontFamily: 'DMSans_800ExtraBold', fontSize: 20, color: COLORS.text }}>{value}</Text>
      <Text style={{ fontFamily: 'DMSans_500Medium', fontSize: 10, color: COLORS.muted, marginTop: 2 }}>{label}</Text>
    </View>
  )
}

function PriorityCard({ item, index }: { item: any; index: number }) {
  const sc = STATUS_COLORS_NATIVE[item.status as keyof typeof STATUS_COLORS_NATIVE] || STATUS_COLORS_NATIVE.programmato
  const cat = CATEGORIES.find(c => c.id === item.category)
  const cc = cat ? CAT_COLORS_NATIVE[cat.color] : CAT_COLORS_NATIVE.indigo
  const days = getDaysLeft(item.date)

  return (
    <TouchableOpacity
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/deadline/${item.id}`) }}
      className="flex-row items-center gap-3 px-4 py-3.5 border-b border-slate-50"
      style={index === 0 ? { backgroundColor: '#fff1f205' } : {}}
      accessibilityLabel={`Scadenza ${item.title}, ${days <= 0 ? 'scaduta' : `tra ${days} giorni`}`}
    >
      <View style={{ width: 28, height: 28, borderRadius: 10, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'DMSans_700Bold', fontSize: 10, color: COLORS.muted }}>#{index + 1}</Text>
      </View>
      <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: cc.bg, alignItems: 'center', justifyContent: 'center' }}>
        <FileText size={16} color={cc.icon} />
      </View>
      <View className="flex-1 min-w-0">
        <View className="flex-row items-center gap-2">
          <Text style={{ fontFamily: 'DMSans_700Bold', fontSize: 13, color: COLORS.text }} numberOfLines={1}>{item.title}</Text>
          {index === 0 && (
            <View style={{ backgroundColor: COLORS.danger, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 }}>
              <Text style={{ fontFamily: 'DMSans_700Bold', fontSize: 8, color: '#fff' }}>URGENTE</Text>
            </View>
          )}
        </View>
        <Text style={{ fontFamily: 'DMSans_400Regular', fontSize: 11, color: COLORS.muted }} numberOfLines={1}>{item.subtitle}</Text>
      </View>
      <View className="items-end">
        <Text style={{ fontFamily: 'DMSans_700Bold', fontSize: 12, color: COLORS.text }}>{formatDate(item.date)}</Text>
        <Text style={{ fontFamily: 'DMSans_600SemiBold', fontSize: 10, color: days <= 2 ? COLORS.danger : days <= 7 ? COLORS.warning : COLORS.muted }}>
          {days <= 0 ? 'Scaduto' : days === 1 ? 'Domani' : `${days}gg`}
        </Text>
      </View>
      <View style={{ backgroundColor: sc.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
        <Text style={{ fontFamily: 'DMSans_700Bold', fontSize: 9, color: sc.text }}>{STATUS_CONFIG[item.status]?.label}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default function DashboardScreen() {
  const { user } = useAuth()
  const { deadlines } = useUserDeadlines(user?.id ?? null)
  const { criticalItems, kpis, notifOpen, setNotifOpen } = useDashboard(deadlines)

  const kpiList = [
    { label: 'Scadenze 7gg',  value: kpis.next7,                                     icon: AlertTriangle, trend: +2,  color: COLORS.danger   },
    { label: 'Scadenze 30gg', value: kpis.next30,                                    icon: Clock,         trend: -1,  color: COLORS.warning  },
    { label: 'Uscite mese',   value: `€${kpis.totalMonth.toLocaleString('it-IT')}`,  icon: DollarSign,    trend: +18, color: COLORS.primary  },
    { label: 'Totale anno',   value: `€${kpis.totalYear.toLocaleString('it-IT')}`,   icon: BarChart2,     trend: +7,  color: COLORS.success  },
    { label: 'Doc. scad.',    value: kpis.docScad,                                   icon: FileText,      trend: 0,   color: '#a855f7'       },
    { label: 'Rinnovi auto',  value: kpis.autoRenew,                                 icon: RefreshCw,     trend: +1,  color: '#0ea5e9'       },
  ]

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
          <View>
            <Text style={{ fontFamily: 'DMSans_800ExtraBold', fontSize: 22, color: COLORS.text }}>Buongiorno, Enrico</Text>
            <Text style={{ fontFamily: 'DMSans_400Regular', fontSize: 13, color: COLORS.muted, marginTop: 2 }}>
              {criticalItems.length} scadenze urgenti oggi
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              className="w-11 h-11 bg-white rounded-xl items-center justify-center"
              style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}
              onPress={() => setNotifOpen(!notifOpen)}
              accessibilityLabel="Apri notifiche"
            >
              <Bell size={20} color={COLORS.muted} />
              {criticalItems.length > 0 && (
                <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/profilo')}
              className="w-11 h-11 rounded-xl items-center justify-center"
              style={{ backgroundColor: COLORS.primary }}
              accessibilityLabel="Apri profilo"
            >
              <Text style={{ fontFamily: 'DMSans_800ExtraBold', fontSize: 14, color: '#fff' }}>EL</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* KPI Grid */}
        <View className="px-2.5 mt-3">
          <View className="flex-row mb-3">
            {kpiList.slice(0, 3).map((k, i) => (
              <KPICard key={i} {...k} />
            ))}
          </View>
          <View className="flex-row">
            {kpiList.slice(3, 6).map((k, i) => (
              <KPICard key={i} {...k} />
            ))}
          </View>
        </View>

        {/* Priorità del Giorno */}
        <View className="mx-4 mt-5 bg-white rounded-2xl overflow-hidden" style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 }}>
          <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-slate-100">
            <View className="flex-row items-center gap-2">
              <View className="w-2 h-2 bg-rose-500 rounded-full" />
              <Text style={{ fontFamily: 'DMSans_700Bold', fontSize: 14, color: COLORS.text }}>Priorità del Giorno</Text>
              <View className="bg-rose-100 rounded-full px-2 py-0.5">
                <Text style={{ fontFamily: 'DMSans_700Bold', fontSize: 10, color: COLORS.danger }}>{criticalItems.length}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => router.push('/scadenze')} accessibilityLabel="Vedi tutte le scadenze">
              <ChevronRight size={18} color={COLORS.muted} />
            </TouchableOpacity>
          </View>
          {criticalItems.map((item, idx) => (
            <PriorityCard key={item.id} item={item} index={idx} />
          ))}
        </View>

        {/* Spazio bottom */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  )
}

import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AlertTriangle, RefreshCw, FileText, CreditCard, CheckCircle } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { COLORS } from '@dovuto/data'

const NOTIFICATIONS = [
  { id: 1, icon: AlertTriangle, title: 'Alert Fiscale',  msg: 'Modello 730 scaduto — azione immediata',    color: COLORS.danger,  bg: '#fff1f2', time: '5 min fa',   unread: true  },
  { id: 2, icon: RefreshCw,    title: 'Rinnovo Auto',   msg: 'Assicurazione Panda scade tra 2 giorni',    color: COLORS.warning, bg: '#fffbeb', time: '1 ora fa',   unread: true  },
  { id: 3, icon: FileText,     title: 'Documento',      msg: 'Passaporto Sergio — scade tra 32 giorni',   color: COLORS.primary, bg: '#eef2ff', time: '3 ore fa',   unread: true  },
  { id: 4, icon: CreditCard,   title: 'Abbonamento',    msg: 'Rinnovo PEC — 22 Giugno',                   color: '#0ea5e9',      bg: '#f0f9ff', time: '1 giorno fa',unread: false },
  { id: 5, icon: CheckCircle,  title: 'Completata',     msg: 'Pagamento F24 IRPEF registrato',            color: COLORS.success, bg: '#ecfdf5', time: '2 giorni fa',unread: false },
]

export default function NotificheScreen() {
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontFamily: 'DMSans_800ExtraBold', fontSize: 22, color: '#0f172a' }}>Notifiche</Text>
          <Text style={{ fontFamily: 'DMSans_400Regular', fontSize: 13, color: '#64748b', marginTop: 2 }}>
            {unreadCount} non lette
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff' }}
          accessibilityLabel="Segna tutte come lette"
        >
          <Text style={{ fontFamily: 'DMSans_600SemiBold', fontSize: 12, color: '#64748b' }}>Leggi tutte</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS.map((notif) => {
          const Icon = notif.icon
          return (
            <TouchableOpacity
              key={notif.id}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={{
                flexDirection: 'row', alignItems: 'flex-start', gap: 12,
                backgroundColor: notif.unread ? '#fafbff' : '#fff',
                paddingHorizontal: 16, paddingVertical: 14,
                borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
              }}
              accessibilityLabel={`${notif.title}: ${notif.msg}`}
            >
              {notif.unread && (
                <View style={{ position: 'absolute', left: 6, top: 18, width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.primary }} />
              )}
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: notif.bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color={notif.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily: 'DMSans_700Bold', fontSize: 13, color: '#0f172a' }}>{notif.title}</Text>
                  <Text style={{ fontFamily: 'DMSans_400Regular', fontSize: 11, color: '#94a3b8' }}>{notif.time}</Text>
                </View>
                <Text style={{ fontFamily: 'DMSans_400Regular', fontSize: 12, color: '#64748b', marginTop: 3, lineHeight: 17 }}>{notif.msg}</Text>
              </View>
            </TouchableOpacity>
          )
        })}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

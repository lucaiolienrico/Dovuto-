import { Tabs, router } from 'expo-router'
import { View, Text, TouchableOpacity } from 'react-native'
import { Activity, Clock, Calendar, Bell, Plus } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { COLORS } from '@dovuto/data'
import { useDashboard } from '@dovuto/hooks'

function TabIcon({ icon: Icon, focused, color }: { icon: any; focused: boolean; color: string }) {
  return (
    <View className="items-center justify-center w-11 h-11">
      <Icon size={22} color={focused ? COLORS.primary : '#94a3b8'} strokeWidth={focused ? 2.5 : 2} />
    </View>
  )
}

function CenterButton() {
  return (
    <TouchableOpacity
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/modal/nuova-scadenza') }}
      className="w-14 h-14 bg-indigo-600 rounded-2xl items-center justify-center -mt-6"
      style={{ shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 }}
      accessibilityLabel="Aggiungi nuova scadenza"
      accessibilityRole="button"
    >
      <Plus size={26} color="#ffffff" strokeWidth={2.5} />
    </TouchableOpacity>
  )
}

export default function TabLayout() {
  const { kpis } = useDashboard()
  const criticalCount = kpis.next7

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          borderTopWidth: 1,
          height: 84,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'DMSans_600SemiBold',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabIcon icon={Activity} focused={focused} color={COLORS.primary} />,
          tabBarBadge: criticalCount > 0 ? criticalCount : undefined,
          tabBarBadgeStyle: { backgroundColor: COLORS.danger, fontSize: 10 },
        }}
      />
      <Tabs.Screen
        name="scadenze"
        options={{
          title: 'Scadenze',
          tabBarIcon: ({ focused }) => <TabIcon icon={Clock} focused={focused} color={COLORS.primary} />,
        }}
      />
      <Tabs.Screen
        name="nuova"
        options={{
          title: '',
          tabBarIcon: () => null,
          tabBarButton: () => <CenterButton />,
        }}
      />
      <Tabs.Screen
        name="calendario"
        options={{
          title: 'Calendario',
          tabBarIcon: ({ focused }) => <TabIcon icon={Calendar} focused={focused} color={COLORS.primary} />,
        }}
      />
      <Tabs.Screen
        name="notifiche"
        options={{
          title: 'Notifiche',
          tabBarIcon: ({ focused }) => <TabIcon icon={Bell} focused={focused} color={COLORS.primary} />,
        }}
      />
    </Tabs>
  )
}

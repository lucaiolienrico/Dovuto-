import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import {
  ChevronLeft, ChevronRight, User, Bell, Fingerprint, CreditCard,
  Shield, LogOut, Sparkles, Star
} from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { COLORS } from '@dovuto/data'
import {
  getBiometricType, biometricLabel, isBiometricsEnabled,
  enableBiometrics, disableBiometrics, type BiometricType,
} from '../lib/biometrics'
import { Prefs, PREF_KEYS } from '../lib/storage'
import { requestNotificationPermissions, cancelAll } from '../lib/notifications'
import { useAuth } from '../lib/AuthContext'

export default function ProfiloScreen() {
  const { user, profile, plan, signOut } = useAuth()
  const [bioType, setBioType] = useState<BiometricType>('none')
  const [bioEnabled, setBioEnabled] = useState(false)
  const [notifEnabled, setNotifEnabled] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)

  useEffect(() => {
    getBiometricType().then(setBioType)
    setBioEnabled(isBiometricsEnabled())
    setNotifEnabled(Prefs.getBool(PREF_KEYS.notificationsEnabled, true))
    setWeeklyDigest(Prefs.getBool(PREF_KEYS.weeklyDigest, true))
  }, [])

  const toggleBiometrics = async (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (value) {
      const res = await enableBiometrics()
      if (res.success) setBioEnabled(true)
      else Alert.alert('Errore', res.error ?? 'Impossibile attivare')
    } else {
      disableBiometrics()
      setBioEnabled(false)
    }
  }

  const toggleNotifications = async (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (value) {
      const granted = await requestNotificationPermissions()
      setNotifEnabled(granted)
      if (!granted) Alert.alert('Permesso negato', 'Abilita le notifiche dalle impostazioni di sistema')
    } else {
      await cancelAll()
      Prefs.setBool(PREF_KEYS.notificationsEnabled, false)
      setNotifEnabled(false)
    }
  }

  const toggleWeekly = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    Prefs.setBool(PREF_KEYS.weeklyDigest, value)
    setWeeklyDigest(value)
  }

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    Alert.alert('Esci', 'Vuoi disconnetterti da Dovuto?', [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Esci', style: 'destructive', onPress: async () => { await signOut(); router.replace('/') } },
    ])
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} accessibilityLabel="Indietro">
          <ChevronLeft size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profilo</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {/* User card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>EL</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>Enrico Lucaioli</Text>
            <Text style={styles.userEmail}>enrico@example.com</Text>
          </View>
          <View style={styles.proBadge}>
            <Star size={11} color="#fff" fill="#fff" />
            <Text style={styles.proBadgeText}>Pro</Text>
          </View>
        </View>

        {/* Plan banner */}
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/modal/pricing') }}
          style={styles.planBanner}
          accessibilityLabel="Gestisci abbonamento"
        >
          <View style={styles.planIcon}>
            <Sparkles size={18} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.planTitle}>Piano Pro attivo</Text>
            <Text style={styles.planSubtitle}>€89/anno · rinnovo 10 Gen 2025</Text>
          </View>
          <ChevronRight size={18} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        {/* Sicurezza */}
        <Text style={styles.sectionLabel}>SICUREZZA</Text>
        <View style={styles.card}>
          <SettingToggle
            icon={Fingerprint}
            label={bioType === 'none' ? 'Biometria non disponibile' : `Sblocco con ${biometricLabel(bioType)}`}
            value={bioEnabled}
            onValueChange={toggleBiometrics}
            disabled={bioType === 'none'}
          />
        </View>

        {/* Notifiche */}
        <Text style={styles.sectionLabel}>NOTIFICHE</Text>
        <View style={styles.card}>
          <SettingToggle icon={Bell} label="Notifiche push" value={notifEnabled} onValueChange={toggleNotifications} />
          <View style={styles.divider} />
          <SettingToggle icon={Shield} label="Riepilogo settimanale" value={weeklyDigest} onValueChange={toggleWeekly} disabled={!notifEnabled} />
        </View>

        {/* Account */}
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.card}>
          <SettingLink icon={User} label="Modifica profilo" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} />
          <View style={styles.divider} />
          <SettingLink icon={CreditCard} label="Metodi di pagamento" onPress={() => router.push('/modal/pricing')} />
        </View>

        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} accessibilityLabel="Esci dall'account">
          <LogOut size={17} color={COLORS.danger} />
          <Text style={styles.logoutText}>Esci</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Dovuto v0.1.0</Text>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

function SettingToggle({ icon: Icon, label, value, onValueChange, disabled = false }: {
  icon: any; label: string; value: boolean; onValueChange: (v: boolean) => void; disabled?: boolean
}) {
  return (
    <View style={[styles.settingRow, disabled && { opacity: 0.5 }]}>
      <View style={styles.settingIcon}>
        <Icon size={17} color={COLORS.muted} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: '#e2e8f0', true: '#c7d2fe' }}
        thumbColor={value ? COLORS.primary : '#f1f5f9'}
        accessibilityLabel={label}
      />
    </View>
  )
}

function SettingLink({ icon: Icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.settingRow} accessibilityLabel={label}>
      <View style={styles.settingIcon}>
        <Icon size={17} color={COLORS.muted} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
      <ChevronRight size={17} color="#cbd5e1" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerTitle: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#0f172a' },
  iconBtn: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  userCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff', borderRadius: 18, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  avatar: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'DMSans_800ExtraBold', fontSize: 18, color: '#fff' },
  userName: { fontFamily: 'DMSans_700Bold', fontSize: 16, color: '#0f172a' },
  userEmail: { fontFamily: 'DMSans_400Regular', fontSize: 13, color: '#64748b', marginTop: 1 },
  proBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#8b5cf6', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  proBadgeText: { fontFamily: 'DMSans_700Bold', fontSize: 11, color: '#fff' },
  planBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#4f46e5', borderRadius: 18, padding: 16, marginTop: 14, shadowColor: '#4f46e5', shadowOpacity: 0.25, shadowRadius: 12, elevation: 4 },
  planIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  planTitle: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: '#fff' },
  planSubtitle: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 1 },
  sectionLabel: { fontFamily: 'DMSans_600SemiBold', fontSize: 11, color: '#94a3b8', letterSpacing: 1, marginTop: 22, marginBottom: 8, marginLeft: 4 },
  card: { backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 14, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  settingIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  settingLabel: { fontFamily: 'DMSans_500Medium', fontSize: 14, color: '#334155', flex: 1 },
  divider: { height: 1, backgroundColor: '#f1f5f9' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: '#fecdd3' },
  logoutText: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: '#f43f5e' },
  version: { fontFamily: 'DMSans_400Regular', fontSize: 11, color: '#cbd5e1', textAlign: 'center', marginTop: 16 },
})

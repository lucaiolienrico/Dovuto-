import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Sparkles, Lock, Mail, Eye, EyeOff, AlertCircle, Shield, ChevronLeft } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { ADMIN_CREDENTIALS } from '@dovuto/data'
import { auth as authApi, profiles } from '@dovuto/api'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')
    setLoading(true)

    // Percorso demo (offline): credenziali statiche
    if (email.trim() === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      await new Promise(r => setTimeout(r, 400))
      setLoading(false)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      router.replace('/admin/dashboard')
      return
    }

    // Percorso reale: Supabase auth + verifica is_admin
    try {
      const { data, error: signErr } = await authApi.signIn(email.trim(), password)
      if (signErr || !data?.user) {
        setLoading(false)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        setError('Credenziali non valide')
        return
      }
      const profile = await profiles.get(data.user.id)
      setLoading(false)
      if (profile?.is_admin) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        router.replace('/admin/dashboard')
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        setError('Accesso riservato agli amministratori')
      }
    } catch {
      setLoading(false)
      setError('Errore di connessione')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Indietro">
          <ChevronLeft size={22} color="#94a3b8" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.logoRow}>
            <View style={styles.logo}>
              <Sparkles size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.brand}>Dovuto</Text>
              <Text style={styles.brandSub}>Admin Panel</Text>
            </View>
          </View>

          <Text style={styles.title}>Accesso riservato</Text>
          <Text style={styles.subtitle}>Inserisci le credenziali amministratore</Text>

          {error ? (
            <View style={styles.errorBox}>
              <AlertCircle size={15} color="#fb7185" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Email */}
          <Text style={styles.label}>EMAIL</Text>
          <View style={styles.inputWrap}>
            <Mail size={15} color="#64748b" style={styles.inputIcon} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="admin@dovuto.it"
              placeholderTextColor="#475569"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              accessibilityLabel="Email amministratore"
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>PASSWORD</Text>
          <View style={styles.inputWrap}>
            <Lock size={15} color="#64748b" style={styles.inputIcon} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#475569"
              secureTextEntry={!showPw}
              autoCapitalize="none"
              style={[styles.input, { paddingRight: 44 }]}
              accessibilityLabel="Password amministratore"
            />
            <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeBtn} accessibilityLabel="Mostra password">
              {showPw ? <EyeOff size={15} color="#64748b" /> : <Eye size={15} color="#64748b" />}
            </TouchableOpacity>
          </View>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={[styles.submitBtn, loading && { opacity: 0.7 }]}
            accessibilityLabel="Accedi al pannello"
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Lock size={15} color="#fff" />
                <Text style={styles.submitText}>Accedi al pannello</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Demo hint */}
          <View style={styles.hint}>
            <Shield size={12} color="#475569" />
            <Text style={styles.hintText}>Demo: admin@dovuto.it / admin2024</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: 8, marginTop: 4 },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 28 },
  logo: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center' },
  brand: { fontFamily: 'DMSans_700Bold', fontSize: 16, color: '#fff' },
  brandSub: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: '#64748b' },
  title: { fontFamily: 'DMSans_800ExtraBold', fontSize: 24, color: '#fff' },
  subtitle: { fontFamily: 'DMSans_400Regular', fontSize: 14, color: '#94a3b8', marginTop: 4, marginBottom: 24 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(244,63,94,0.1)', borderWidth: 1, borderColor: 'rgba(244,63,94,0.2)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16 },
  errorText: { fontFamily: 'DMSans_500Medium', fontSize: 13, color: '#fb7185' },
  label: { fontFamily: 'DMSans_600SemiBold', fontSize: 11, color: '#94a3b8', letterSpacing: 1, marginBottom: 8, marginTop: 8 },
  inputWrap: { position: 'relative', marginBottom: 4 },
  inputIcon: { position: 'absolute', left: 14, top: 16, zIndex: 1 },
  input: { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 12, paddingLeft: 40, paddingRight: 14, paddingVertical: 14, fontFamily: 'DMSans_400Regular', fontSize: 14, color: '#fff' },
  eyeBtn: { position: 'absolute', right: 14, top: 15 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#4f46e5', borderRadius: 14, paddingVertical: 16, marginTop: 20 },
  submitText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#fff' },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(15,23,42,0.5)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginTop: 20 },
  hintText: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: '#64748b' },
})

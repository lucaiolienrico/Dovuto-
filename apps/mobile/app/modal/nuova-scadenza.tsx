import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { X, Save, ChevronDown } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import { CATEGORIES, COLORS } from '@dovuto/data'

const STATUSES = [
  { id: 'programmato', label: 'Programmato' },
  { id: 'in_scadenza', label: 'In Scadenza' },
  { id: 'critico',     label: 'Critico'     },
  { id: 'completato',  label: 'Completato'  },
]

export default function NuovaScadenzaModal() {
  const [title, setTitle]       = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [category, setCategory] = useState('finanza')
  const [date, setDate]         = useState('')
  const [amount, setAmount]     = useState('')
  const [status, setStatus]     = useState('programmato')

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    // In production: call useDeadlines().add(...)
    router.back()
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nuova Scadenza</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeBtn}
            accessibilityLabel="Chiudi"
          >
            <X size={18} color={COLORS.muted} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 14 }} keyboardShouldPersistTaps="handled">

          <View>
            <Text style={styles.label}>Titolo *</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="es. Bollo Auto Fiat"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              accessibilityLabel="Titolo scadenza"
            />
          </View>

          <View>
            <Text style={styles.label}>Descrizione</Text>
            <TextInput
              value={subtitle}
              onChangeText={setSubtitle}
              placeholder="Dettagli aggiuntivi..."
              placeholderTextColor="#94a3b8"
              style={styles.input}
              accessibilityLabel="Descrizione scadenza"
            />
          </View>

          <View>
            <Text style={styles.label}>Categoria</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setCategory(cat.id) }}
                  style={[styles.chip, category === cat.id && styles.chipActive]}
                  accessibilityLabel={cat.label}
                >
                  <Text style={[styles.chipText, category === cat.id && styles.chipTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Data scadenza *</Text>
              <TextInput
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94a3b8"
                style={styles.input}
                accessibilityLabel="Data scadenza"
              />
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Importo (€)</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#94a3b8"
                keyboardType="decimal-pad"
                style={styles.input}
                accessibilityLabel="Importo in euro"
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Stato</Text>
            <View style={styles.row}>
              {STATUSES.map(s => (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setStatus(s.id) }}
                  style={[styles.statusBtn, status === s.id && styles.statusBtnActive]}
                  accessibilityLabel={s.label}
                >
                  <Text style={[styles.statusText, status === s.id && styles.statusTextActive]}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </ScrollView>

        {/* Save button */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!title || !date}
            style={[styles.saveBtn, (!title || !date) && styles.saveBtnDisabled]}
            accessibilityLabel="Salva scadenza"
          >
            <Save size={18} color="#fff" />
            <Text style={styles.saveBtnText}>Crea Scadenza</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerTitle: { fontFamily: 'DMSans_700Bold', fontSize: 16, color: '#0f172a' },
  closeBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: 'DMSans_600SemiBold', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontFamily: 'DMSans_400Regular', fontSize: 14, color: '#0f172a' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', marginRight: 8, marginBottom: 4 },
  chipActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  chipText: { fontFamily: 'DMSans_600SemiBold', fontSize: 12, color: '#64748b' },
  chipTextActive: { color: '#fff' },
  statusBtn: { flex: 1, paddingVertical: 9, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  statusBtnActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  statusText: { fontFamily: 'DMSans_600SemiBold', fontSize: 11, color: '#64748b' },
  statusTextActive: { color: '#fff' },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#4f46e5', borderRadius: 14, paddingVertical: 16 },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: '#fff' },
})

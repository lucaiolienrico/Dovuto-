import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { X, Check, Lock, RefreshCw, Shield } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import { PLANS, COLORS } from '@dovuto/data'
import type { Plan } from '@dovuto/data'

const PLAN_ACCENT: Record<string, string> = {
  slate:   '#64748b',
  indigo:  '#4f46e5',
  emerald: '#10b981',
  violet:  '#8b5cf6',
}

function PlanCard({ plan, annual }: { plan: Plan; annual: boolean }) {
  const isPopular = plan.id === 'personal'
  const accent = PLAN_ACCENT[plan.color] ?? COLORS.primary
  const price = annual ? plan.annual : plan.price
  const period = annual ? '/anno' : '/mese'
  const saving = annual && plan.price > 0 ? (plan.price * 12 - plan.annual).toFixed(0) : null

  return (
    <View style={[styles.planCard, isPopular && { borderColor: accent, borderWidth: 2 }]}>
      {plan.badge && (
        <View style={[styles.badge, { backgroundColor: accent }]}>
          <Text style={styles.badgeText}>{plan.badge}</Text>
        </View>
      )}

      <Text style={[styles.planName, { color: accent }]}>{plan.name}</Text>
      <Text style={styles.planDesc}>{plan.desc}</Text>

      <View style={styles.priceRow}>
        {plan.price === 0 ? (
          <Text style={styles.priceFree}>Gratis</Text>
        ) : (
          <>
            <Text style={styles.price}>€{price}</Text>
            <Text style={styles.period}>{period}</Text>
          </>
        )}
      </View>
      {saving && <Text style={styles.saving}>Risparmi €{saving} vs mensile</Text>}

      <View style={styles.features}>
        {plan.features.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={[styles.featureCheck, { backgroundColor: f.ok ? `${accent}1a` : '#f1f5f9' }]}>
              {f.ok
                ? <Check size={11} color={accent} />
                : <X size={9} color="#94a3b8" />}
            </View>
            <Text style={[styles.featureText, { color: f.ok ? '#334155' : '#94a3b8' }]}>{f.text}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); router.back() }}
        style={[styles.ctaBtn, plan.ctaStyle === 'outline' ? styles.ctaOutline : { backgroundColor: accent }]}
        accessibilityLabel={plan.cta}
      >
        <Text style={[styles.ctaText, plan.ctaStyle === 'outline' && { color: '#334155' }]}>{plan.cta}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function PricingModal() {
  const [annual, setAnnual] = useState(true)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Scegli il tuo piano</Text>
          <Text style={styles.headerSubtitle}>Cancella quando vuoi</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} accessibilityLabel="Chiudi">
          <X size={18} color={COLORS.muted} />
        </TouchableOpacity>
      </View>

      {/* Toggle */}
      <View style={styles.toggleWrap}>
        <View style={styles.toggle}>
          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setAnnual(false) }}
            style={[styles.toggleBtn, !annual && styles.toggleBtnActive]}
            accessibilityLabel="Prezzi mensili"
          >
            <Text style={[styles.toggleText, !annual && styles.toggleTextActive]}>Mensile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setAnnual(true) }}
            style={[styles.toggleBtn, annual && styles.toggleBtnActive]}
            accessibilityLabel="Prezzi annuali"
          >
            <Text style={[styles.toggleText, annual && styles.toggleTextActive]}>Annuale</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-40%</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16 }}>
        {PLANS.map(plan => (
          <PlanCard key={plan.id} plan={plan} annual={annual} />
        ))}

        <View style={styles.trust}>
          <View style={styles.trustItem}>
            <Lock size={13} color={COLORS.primary} />
            <Text style={styles.trustText}>Pagamento sicuro Stripe</Text>
          </View>
          <View style={styles.trustItem}>
            <RefreshCw size={13} color={COLORS.success} />
            <Text style={styles.trustText}>Cancella quando vuoi</Text>
          </View>
          <View style={styles.trustItem}>
            <Shield size={13} color={COLORS.primary} />
            <Text style={styles.trustText}>GDPR compliant</Text>
          </View>
        </View>
        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerTitle: { fontFamily: 'DMSans_700Bold', fontSize: 16, color: '#0f172a' },
  headerSubtitle: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: '#64748b', marginTop: 1 },
  closeBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  toggleWrap: { alignItems: 'center', paddingTop: 16 },
  toggle: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 12, padding: 4 },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingVertical: 8, borderRadius: 9 },
  toggleBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  toggleText: { fontFamily: 'DMSans_600SemiBold', fontSize: 13, color: '#64748b' },
  toggleTextActive: { color: '#0f172a' },
  discountBadge: { backgroundColor: '#d1fae5', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  discountText: { fontFamily: 'DMSans_700Bold', fontSize: 9, color: '#047857' },
  planCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  badge: { position: 'absolute', top: -10, alignSelf: 'center', left: 0, right: 0, marginHorizontal: 'auto', width: 90, borderRadius: 10, paddingVertical: 4, alignItems: 'center' },
  badgeText: { fontFamily: 'DMSans_700Bold', fontSize: 10, color: '#fff' },
  planName: { fontFamily: 'DMSans_700Bold', fontSize: 16, marginTop: 4 },
  planDesc: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: '#64748b', marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 14 },
  price: { fontFamily: 'DMSans_800ExtraBold', fontSize: 32, color: '#0f172a' },
  priceFree: { fontFamily: 'DMSans_800ExtraBold', fontSize: 32, color: '#0f172a' },
  period: { fontFamily: 'DMSans_400Regular', fontSize: 14, color: '#94a3b8', marginBottom: 5, marginLeft: 3 },
  saving: { fontFamily: 'DMSans_600SemiBold', fontSize: 12, color: '#10b981', marginTop: 4 },
  features: { marginTop: 16, gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureCheck: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  featureText: { fontFamily: 'DMSans_400Regular', fontSize: 13 },
  ctaBtn: { marginTop: 18, paddingVertical: 13, borderRadius: 12, alignItems: 'center' },
  ctaOutline: { borderWidth: 1.5, borderColor: '#e2e8f0', backgroundColor: 'transparent' },
  ctaText: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: '#fff' },
  trust: { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  trustText: { fontFamily: 'DMSans_500Medium', fontSize: 12, color: '#64748b' },
})

import { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { DEADLINES, COLORS, STATUS_COLORS_NATIVE, formatCurrency } from '@dovuto/data'

const DAYS_IT = ['L', 'M', 'M', 'G', 'V', 'S', 'D']
const MONTHS_IT = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']

export default function CalendarioScreen() {
  const [current, setCurrent] = useState(new Date(2024, 5, 1))
  const [selectedDay, setSelectedDay] = useState<number | null>(16)

  const year = current.getFullYear()
  const month = current.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const adjusted = (firstDay + 6) % 7

  const deadlineDays = DEADLINES.reduce<Record<number, string[]>>((acc, d) => {
    const dd = new Date(d.date)
    if (dd.getFullYear() === year && dd.getMonth() === month) {
      const day = dd.getDate()
      if (!acc[day]) acc[day] = []
      acc[day].push(d.status)
    }
    return acc
  }, {})

  const dotColor = (statuses: string[]) => {
    if (statuses.includes('critico'))     return COLORS.danger
    if (statuses.includes('scade_oggi'))  return COLORS.warning
    if (statuses.includes('in_scadenza')) return '#fb923c'
    return COLORS.primary
  }

  const selectedDeadlines = selectedDay
    ? DEADLINES.filter(d => {
        const dd = new Date(d.date)
        return dd.getFullYear() === year && dd.getMonth() === month && dd.getDate() === selectedDay
      })
    : []

  const cells: (number | null)[] = []
  for (let i = 0; i < adjusted; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
          <Text style={{ fontFamily: 'DMSans_800ExtraBold', fontSize: 22, color: '#0f172a' }}>Calendario</Text>
        </View>

        {/* Calendar card */}
        <View style={{ marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 }}>
          {/* Month nav */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setCurrent(new Date(year, month - 1, 1)) }}
              style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' }}
              accessibilityLabel="Mese precedente"
            >
              <ChevronLeft size={18} color={COLORS.muted} />
            </TouchableOpacity>
            <Text style={{ fontFamily: 'DMSans_700Bold', fontSize: 16, color: '#0f172a', textTransform: 'capitalize' }}>
              {MONTHS_IT[month]} {year}
            </Text>
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setCurrent(new Date(year, month + 1, 1)) }}
              style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' }}
              accessibilityLabel="Mese successivo"
            >
              <ChevronRight size={18} color={COLORS.muted} />
            </TouchableOpacity>
          </View>

          {/* Day labels */}
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            {DAYS_IT.map((d, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontFamily: 'DMSans_600SemiBold', fontSize: 11, color: '#94a3b8' }}>{d}</Text>
              </View>
            ))}
          </View>

          {/* Days grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {cells.map((day, i) => {
              const isToday = day === 16
              const isSelected = day === selectedDay
              const hasDeadlines = day && deadlineDays[day]
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => { if (day) { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedDay(day) } }}
                  style={{ width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' }}
                  disabled={!day}
                  accessibilityLabel={day ? `${day} ${MONTHS_IT[month]}` : undefined}
                >
                  {day && (
                    <>
                      <View style={{
                        width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                        backgroundColor: isSelected ? COLORS.primary : isToday ? '#eef2ff' : 'transparent',
                      }}>
                        <Text style={{
                          fontFamily: isToday || isSelected ? 'DMSans_700Bold' : 'DMSans_400Regular',
                          fontSize: 13,
                          color: isSelected ? '#fff' : isToday ? COLORS.primary : '#334155',
                        }}>{day}</Text>
                      </View>
                      {hasDeadlines && (
                        <View style={{
                          position: 'absolute', bottom: 2,
                          width: 5, height: 5, borderRadius: 3,
                          backgroundColor: isSelected ? '#fff' : dotColor(deadlineDays[day]),
                        }} />
                      )}
                    </>
                  )}
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Selected day deadlines */}
        {selectedDay && (
          <View style={{ marginHorizontal: 16, marginTop: 16 }}>
            <Text style={{ fontFamily: 'DMSans_700Bold', fontSize: 14, color: '#0f172a', marginBottom: 10 }}>
              {selectedDay} {MONTHS_IT[month]}
              {selectedDeadlines.length > 0 ? ` — ${selectedDeadlines.length} scadenz${selectedDeadlines.length === 1 ? 'a' : 'e'}` : ' — nessuna scadenza'}
            </Text>
            {selectedDeadlines.map(d => {
              const sc = STATUS_COLORS_NATIVE[d.status] || STATUS_COLORS_NATIVE.programmato
              return (
                <View key={d.id} style={{ backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: sc.dot }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'DMSans_600SemiBold', fontSize: 13, color: '#0f172a' }}>{d.title}</Text>
                    <Text style={{ fontFamily: 'DMSans_400Regular', fontSize: 11, color: '#64748b' }}>{d.subtitle}</Text>
                  </View>
                  {d.amount > 0 && (
                    <Text style={{ fontFamily: 'DMSans_700Bold', fontSize: 13, color: '#0f172a' }}>{formatCurrency(d.amount)}</Text>
                  )}
                </View>
              )
            })}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

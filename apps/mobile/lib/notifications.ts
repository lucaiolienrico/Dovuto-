import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import type { Deadline } from '@dovuto/data'
import { getDaysLeft } from '@dovuto/data'
import { Prefs, PREF_KEYS } from './storage'

// ─── Permissions ─────────────────────────────────────────────────────────────

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.warn('[Notifications] push works only on physical devices')
    return false
  }

  const { status: existing } = await Notifications.getPermissionsAsync()
  let finalStatus = existing

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') return false

  // Android requires a notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('scadenze', {
      name: 'Scadenze',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4f46e5',
      sound: 'default',
    })
  }

  Prefs.setBool(PREF_KEYS.notificationsEnabled, true)
  return true
}

// ─── Push token (for server-side push via Expo) ─────────────────────────────

export async function getExpoPushToken(projectId: string): Promise<string | null> {
  try {
    const token = await Notifications.getExpoPushTokenAsync({ projectId })
    return token.data
  } catch (e) {
    console.error('[Notifications] token fetch failed', e)
    return null
  }
}

// ─── Schedule local notifications for a single deadline ──────────────────────
// Alert at 30 days, 7 days, and day-of (09:00).

const ALERT_OFFSETS = [30, 7, 0] as const

export async function scheduleDeadlineAlerts(deadline: Deadline): Promise<string[]> {
  const ids: string[] = []
  const dueDate = new Date(deadline.date)

  for (const offset of ALERT_OFFSETS) {
    const triggerDate = new Date(dueDate)
    triggerDate.setDate(triggerDate.getDate() - offset)
    triggerDate.setHours(9, 0, 0, 0)

    // Skip if the trigger moment is already in the past
    if (triggerDate.getTime() <= Date.now()) continue

    const body =
      offset === 0
        ? `"${deadline.title}" scade oggi`
        : `"${deadline.title}" scade tra ${offset} giorni`

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: offset === 0 ? '⚠️ Scadenza oggi' : '📅 Promemoria scadenza',
        body,
        data: { deadlineId: deadline.id, url: `/deadline/${deadline.id}` },
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
        channelId: 'scadenze',
      },
    })
    ids.push(id)
  }

  return ids
}

// ─── Weekly digest: every Monday at 09:00 ────────────────────────────────────

export async function scheduleWeeklyDigest(deadlineCount: number): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: '📊 Riepilogo settimanale',
      body: `Hai ${deadlineCount} scadenze questa settimana. Controlla Dovuto.`,
      data: { url: '/' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 2, // 1 = Sunday, 2 = Monday (Expo convention)
      hour: 9,
      minute: 0,
      channelId: 'scadenze',
    },
  })
}

// ─── Bulk reschedule: clears all and re-schedules from a list ────────────────

export async function rescheduleAll(deadlines: Deadline[]): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync()

  // Only future, non-completed deadlines
  const upcoming = deadlines.filter(
    d => d.status !== 'completato' && getDaysLeft(d.date) >= 0,
  )

  for (const d of upcoming) {
    await scheduleDeadlineAlerts(d)
  }

  if (Prefs.getBool(PREF_KEYS.weeklyDigest, true)) {
    await scheduleWeeklyDigest(upcoming.length)
  }
}

export async function cancelAll(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync()
}

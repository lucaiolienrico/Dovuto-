import '../global.css'
import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useFonts, DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold, DMSans_800ExtraBold } from '@expo-google-fonts/dm-sans'
import * as SplashScreen from 'expo-splash-screen'
import * as Notifications from 'expo-notifications'

SplashScreen.preventAutoHideAsync()

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    DMSans_800ExtraBold,
  })

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="deadline/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="modal/nuova-scadenza" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modal/pricing" options={{ presentation: 'modal' }} />
        <Stack.Screen name="profilo" options={{ presentation: 'card' }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  )
}

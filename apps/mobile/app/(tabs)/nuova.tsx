import { useEffect } from 'react'
import { router } from 'expo-router'

// This tab acts as a trigger — immediately opens the modal
export default function NuovaScreen() {
  useEffect(() => {
    router.replace('/modal/nuova-scadenza')
  }, [])
  return null
}

import Constants from 'expo-constants'
import * as Linking from 'expo-linking'
import * as Updates from 'expo-updates'
import { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'

interface UseCheckUpdateReturn {
  isUpdateAvailable: boolean
  checkForUpdate: () => Promise<void>
  openStore: () => Promise<void>
}

const APP_STORE_ID = '6742852987'
const PLAY_STORE_PACKAGE = Constants.expoConfig?.android?.package || ''

export function useCheckUpdate(): UseCheckUpdateReturn {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)

  const openStore = async () => {
    if (Platform.OS === 'ios') {
      const storeUrl = `itms-apps://apps.apple.com/app/id${APP_STORE_ID}`
      const canOpen = await Linking.canOpenURL(storeUrl)

      if (canOpen) {
        await Linking.openURL(storeUrl)
      }
    } else {
      const storeUrl = `market://details?id=${PLAY_STORE_PACKAGE}`
      const webUrl = `https://play.google.com/store/apps/details?id=${PLAY_STORE_PACKAGE}`

      try {
        await Linking.openURL(storeUrl)
      } catch {
        await Linking.openURL(webUrl)
      }
    }
  }

  const checkForUpdate = useCallback(async () => {
    try {
      const update = await Updates.checkForUpdateAsync()
      setIsUpdateAvailable(update.isAvailable)
    } catch (error) {
      console.error('Error checking for updates:', error)
    }
  }, [])

  useEffect(() => {
    void checkForUpdate()
  }, [checkForUpdate])

  return {
    isUpdateAvailable,
    checkForUpdate,
    openStore,
  }
}

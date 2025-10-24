import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'

export function useLanguage() {
  const { t } = useTranslation()

  const currentLanguage = i18n.language
  const isEnglish = currentLanguage.startsWith('en')
  const isPortuguese = currentLanguage.startsWith('pt')

  const toggleLanguage = async () => {
    const newLanguage = isEnglish ? 'pt' : 'en'
    await i18n.changeLanguage(newLanguage)
    await AsyncStorage.setItem('language', newLanguage)
  }

  return {
    t,
    currentLanguage,
    isEnglish,
    isPortuguese,
    toggleLanguage,
  }
}

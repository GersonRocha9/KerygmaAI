import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Localization from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import pt from './locales/pt.json'

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('language')

  if (!savedLanguage) {
    savedLanguage = Localization.locale
  }

  await i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources: {
      en: { translation: en },
      pt: { translation: pt },
    },
    lng: savedLanguage,
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
  })
}

initI18n()

export default i18n
en

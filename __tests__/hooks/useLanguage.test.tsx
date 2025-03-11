import { useLanguage } from '@/hooks/useLanguage'
import i18n from '@/i18n'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { act, renderHook } from '@testing-library/react-native'

// Mock de módulos
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
}))

jest.mock('@/i18n', () => ({
  language: 'en',
  changeLanguage: jest.fn(() => Promise.resolve()),
  use: jest.fn().mockReturnThis(),
  init: jest.fn(() => Promise.resolve()),
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: jest.fn(key => key),
  }),
}))

describe('useLanguage hook', () => {
  beforeEach(() => {
    // Limpar os mocks entre testes
    jest.clearAllMocks()
    // Definir o idioma para inglês por padrão
    i18n.language = 'en'
  })

  it('deve retornar os valores e funções esperadas', () => {
    const { result } = renderHook(() => useLanguage())

    expect(result.current).toHaveProperty('t')
    expect(result.current).toHaveProperty('currentLanguage')
    expect(result.current).toHaveProperty('isEnglish')
    expect(result.current).toHaveProperty('isPortuguese')
    expect(result.current).toHaveProperty('toggleLanguage')
    expect(typeof result.current.toggleLanguage).toBe('function')
  })

  it('deve detectar corretamente o idioma inglês', () => {
    i18n.language = 'en-US'
    const { result } = renderHook(() => useLanguage())

    expect(result.current.currentLanguage).toBe('en-US')
    expect(result.current.isEnglish).toBe(true)
    expect(result.current.isPortuguese).toBe(false)
  })

  it('deve detectar corretamente o idioma português', () => {
    i18n.language = 'pt-BR'
    const { result } = renderHook(() => useLanguage())

    expect(result.current.currentLanguage).toBe('pt-BR')
    expect(result.current.isEnglish).toBe(false)
    expect(result.current.isPortuguese).toBe(true)
  })

  it('deve alternar do inglês para o português', async () => {
    i18n.language = 'en'
    const { result } = renderHook(() => useLanguage())

    await act(async () => {
      await result.current.toggleLanguage()
    })

    expect(i18n.changeLanguage).toHaveBeenCalledWith('pt')
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('language', 'pt')
  })

  it('deve alternar do português para o inglês', async () => {
    i18n.language = 'pt'
    const { result } = renderHook(() => useLanguage())

    await act(async () => {
      await result.current.toggleLanguage()
    })

    expect(i18n.changeLanguage).toHaveBeenCalledWith('en')
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('language', 'en')
  })
})

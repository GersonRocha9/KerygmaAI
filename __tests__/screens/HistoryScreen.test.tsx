import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import { Alert, TouchableOpacity } from 'react-native'

// Mock do Stack para evitar problemas com expo-router
jest.mock('expo-router', () => ({
  Stack: {
    Screen: (props: any) => null,
  },
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}))

// Mock do serviço de devocionais
jest.mock('@/services/devotionalService', () => ({
  loadDevotionalHistory: jest.fn(() =>
    Promise.resolve([
      {
        id: '1',
        title: 'Devocional 1',
        theme: 'Tema 1',
        date: '01/01/2023',
        content: 'Conteúdo 1',
      },
      {
        id: '2',
        title: 'Devocional 2',
        theme: 'Tema 2',
        date: '02/01/2023',
        content: 'Conteúdo 2',
      },
    ])
  ),
  clearDevotionalHistory: jest.fn(() => Promise.resolve(true)),
}))

// Mock do Alert.alert
jest
  .spyOn(Alert, 'alert')
  .mockImplementation((title, message, buttons) => undefined)

// Importar o componente depois de configurar os mocks
const HistoryScreen = require('@/app/history').default

describe('HistoryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve carregar o histórico de devocionais', async () => {
    const { getByText, queryAllByText } = render(<HistoryScreen />)

    await waitFor(() => {
      expect(queryAllByText(/Devocional \d/).length).toBe(2)
      expect(getByText('Tema: Tema 1')).toBeTruthy()
      expect(getByText('01/01/2023')).toBeTruthy()
    })
  })

  it('deve mostrar o botão de limpar histórico quando existem devocionais', async () => {
    const { getAllByText } = render(<HistoryScreen />)

    await waitFor(() => {
      // Encontra o ícone de lixeira
      const trashIcons = getAllByText('trash.fill')
      expect(trashIcons.length).toBeGreaterThan(0)
    })
  })

  it('deve chamar Alert.alert quando o botão de limpar histórico é pressionado', async () => {
    const { UNSAFE_getAllByType } = render(<HistoryScreen />)

    await waitFor(() => {
      // Encontra todos os TouchableOpacity
      const allTouchables = UNSAFE_getAllByType(TouchableOpacity)

      // Pressiona o primeiro TouchableOpacity, que deve ser o botão de limpar
      if (allTouchables.length > 0) {
        fireEvent.press(allTouchables[0])
      }

      expect(Alert.alert).toHaveBeenCalledWith(
        'Limpar Histórico',
        'Tem certeza que deseja limpar todo o histórico de devocionais?',
        expect.any(Array)
      )
    })
  })
})

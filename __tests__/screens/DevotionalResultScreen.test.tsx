import { render } from '@testing-library/react-native'
import React from 'react'

// Mock do Stack e useLocalSearchParams do expo-router
jest.mock('expo-router', () => ({
  Stack: {
    Screen: (props: any) => null,
  },
  useLocalSearchParams: jest.fn(() => ({
    title: 'Esperança em Tempos Difíceis',
    content:
      'Conteúdo do devocional de teste sobre esperança.\n\nVersículo: "Porque para Deus nada é impossível." - Lucas 1:37\n\nIntrodução\nEm tempos de dificuldade...',
    theme: 'esperança',
    fromHistory: 'true',
  })),
}))

// Mock do serviço de compartilhamento
jest.mock('@/services/shareService', () => ({
  shareDevotional: jest.fn(() => Promise.resolve()),
}))

// Mock do formatador de texto
jest.mock('@/formatters/textFormatters', () => ({
  formatTitle: jest.fn(title => title),
  extractDevotionalParts: jest.fn(() => ({
    verse: 'Porque para Deus nada é impossível.',
    reference: 'Lucas 1:37',
    introducaoParagraphs: ['Em tempos de dificuldade...'],
    topicos: [
      {
        titulo: 'A natureza da esperança',
        paragraphs: ['Parágrafo sobre esperança...'],
      },
      {
        titulo: 'Cultivando esperança',
        paragraphs: ['Como cultivar esperança...'],
      },
    ],
    conclusaoParagraphs: ['Para concluir...'],
    oracaoParagraphs: ['Senhor Deus, te agradecemos...'],
  })),
}))

// Mock do componente ActivityIndicator
jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native')
  return {
    ...rn,
    ActivityIndicator: jest.fn().mockImplementation(props => {
      return <rn.View testID="activity-indicator" {...props} />
    }),
  }
})

// Importar o componente após configurar os mocks
const DevotionalResultScreen = require('@/app/devotional-result').default

describe('DevotionalResultScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar o conteúdo do devocional corretamente', () => {
    const { getByText } = render(<DevotionalResultScreen />)

    // Verifica se o título, versículo e partes do devocional são exibidos
    expect(getByText('Esperança em Tempos Difíceis')).toBeTruthy()
    expect(getByText('Porque para Deus nada é impossível.')).toBeTruthy()
    expect(getByText('Lucas 1:37')).toBeTruthy()
    expect(getByText('Introdução')).toBeTruthy()
    expect(getByText('A natureza da esperança')).toBeTruthy()
    expect(getByText('Conclusão')).toBeTruthy()
    expect(getByText('Oração')).toBeTruthy()
  })
})

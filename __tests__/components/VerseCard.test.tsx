import { VerseCard } from '@/components/VerseCard'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

describe('VerseCard', () => {
  const mockVerse = 'O Senhor é meu pastor, nada me faltará.'
  const mockReference = 'Salmos 23:1'
  const mockOnShare = jest.fn()

  beforeEach(() => {
    mockOnShare.mockClear()
  })

  it('renderiza o verso e referência corretamente', () => {
    const { getByText } = render(
      <VerseCard
        verse={mockVerse}
        reference={mockReference}
        onShare={mockOnShare}
      />
    )

    expect(getByText(mockVerse)).toBeTruthy()
    expect(getByText(mockReference)).toBeTruthy()
  })

  it('chama onShare quando o botão de compartilhar é pressionado', () => {
    const { getByText, getByTestId } = render(
      <VerseCard
        verse={mockVerse}
        reference={mockReference}
        onShare={mockOnShare}
      />
    )

    // Verificamos que o verso e a referência são mostrados
    expect(getByText(mockVerse)).toBeTruthy()
    expect(getByText(mockReference)).toBeTruthy()

    // Procura o botão de compartilhar pelo testID no mock do IconSymbol
    const shareButton = getByTestId('icon-square.and.arrow.up')

    fireEvent.press(shareButton)
    expect(mockOnShare).toHaveBeenCalledTimes(1)
  })

  it('não exibe o botão de compartilhamento quando onShare não é fornecido', () => {
    const { getByText, queryByTestId } = render(
      <VerseCard verse={mockVerse} reference={mockReference} />
    )

    // Verificamos que o verso e a referência são mostrados
    expect(getByText(mockVerse)).toBeTruthy()
    expect(getByText(mockReference)).toBeTruthy()

    // Verificamos que o botão de compartilhar não existe
    const shareIcon = queryByTestId('icon-square.and.arrow.up')
    expect(shareIcon).toBeNull()
  })
})

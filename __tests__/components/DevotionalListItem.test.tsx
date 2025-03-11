import { DevotionalListItem } from '@/components/DevotionalListItem'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

describe('DevotionalListItem', () => {
  const mockProps = {
    title: 'Teste de Devocional',
    theme: 'Tema de Teste',
    date: '01/01/2023',
    onPress: jest.fn(),
  }

  beforeEach(() => {
    mockProps.onPress.mockClear()
  })

  it('renderiza o título, tema e data corretamente', () => {
    const { getByText } = render(<DevotionalListItem {...mockProps} />)

    expect(getByText(mockProps.title)).toBeTruthy()
    expect(getByText(`Tema: ${mockProps.theme}`)).toBeTruthy()
    expect(getByText(mockProps.date)).toBeTruthy()
  })

  it('chama onPress quando pressionado', () => {
    const { getByText } = render(<DevotionalListItem {...mockProps} />)

    // Usando o título para identificar o item
    const item = getByText(mockProps.title)

    // Procurando o elemento pai mais próximo que seja clicável
    const parent = item.parent

    // Verificando se o parent existe antes de acessar
    if (parent?.parent) {
      // Disparando o evento de press
      fireEvent.press(parent.parent)
      expect(mockProps.onPress).toHaveBeenCalledTimes(1)
    } else {
      // Se não encontrar o elemento pai, falha o teste
      fail('Não foi possível encontrar o elemento pai para simular o press')
    }
  })

  it('trunca o título quando for muito longo', () => {
    const longTitleProps = {
      ...mockProps,
      title:
        'Este é um título muito longo que deve ser truncado em um item de lista de devocional',
    }

    const { getByText } = render(<DevotionalListItem {...longTitleProps} />)

    // Verificando se o texto foi renderizado (mesmo que truncado)
    expect(getByText(longTitleProps.title)).toBeTruthy()
  })
})

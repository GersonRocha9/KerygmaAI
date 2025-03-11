import { ThemedText } from '@/components/ThemedText'
import { render } from '@testing-library/react-native'
import React from 'react'

describe('ThemedText', () => {
  it('renderiza texto com estilo padrão', () => {
    const { getByText } = render(<ThemedText>Teste de texto</ThemedText>)

    expect(getByText('Teste de texto')).toBeTruthy()
  })

  it('aplica o tipo de texto corretamente', () => {
    const { getByText } = render(
      <ThemedText type="title">Texto de título</ThemedText>
    )

    expect(getByText('Texto de título')).toBeTruthy()
  })

  it('aplica cor personalizada quando especificada', () => {
    const { getByText } = render(
      <ThemedText lightColor="#FF0000" darkColor="#0000FF">
        Texto colorido
      </ThemedText>
    )

    expect(getByText('Texto colorido')).toBeTruthy()
  })

  it('aplica estilo de variante corretamente', () => {
    const { getByText } = render(
      <ThemedText variant="secondary">Texto secundário</ThemedText>
    )

    expect(getByText('Texto secundário')).toBeTruthy()
  })
})

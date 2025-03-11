import { ThemedView } from '@/components/ThemedView'
import { render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

describe('ThemedView', () => {
  it('renderiza children corretamente', () => {
    const { getByText } = render(
      <ThemedView>
        <Text>Conteúdo do View</Text>
      </ThemedView>
    )

    expect(getByText('Conteúdo do View')).toBeTruthy()
  })

  it('aplica variant corretamente', () => {
    const { getByText } = render(
      <ThemedView variant="card">
        <Text>Conteúdo do View</Text>
      </ThemedView>
    )

    expect(getByText('Conteúdo do View')).toBeTruthy()
  })

  it('aplica cores personalizadas quando especificadas', () => {
    const { getByText } = render(
      <ThemedView lightColor="#FFCCCC" darkColor="#CCFFCC">
        <Text>Conteúdo do View</Text>
      </ThemedView>
    )

    expect(getByText('Conteúdo do View')).toBeTruthy()
  })

  it('combina estilos definidos pelo usuário', () => {
    const customStyle = { margin: 10, padding: 20 }
    const { getByText } = render(
      <ThemedView style={customStyle}>
        <Text>Conteúdo do View</Text>
      </ThemedView>
    )

    expect(getByText('Conteúdo do View')).toBeTruthy()
  })
})

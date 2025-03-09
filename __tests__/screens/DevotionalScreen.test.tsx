import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Keyboard } from 'react-native';

// Mock do useRouter do expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock do keyboard
jest.spyOn(Keyboard, 'dismiss').mockImplementation(() => true);

// Mock do serviço de AI para geração de devocionais
jest.mock('@/services/aiService', () => ({
  generateDevotional: jest.fn(() => Promise.resolve({
    title: 'Devocional de Teste',
    content: 'Conteúdo do devocional gerado para teste',
  })),
}));

// Mock do serviço de devocionais
jest.mock('@/services/devotionalService', () => ({
  saveDevotionalToHistory: jest.fn(() => Promise.resolve(true)),
}));

// Importar o componente após configurar os mocks
const DevotionalScreen = require('@/app/(tabs)/devotional').default;

describe('DevotionalScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o formulário corretamente', () => {
    const { getByText, getByPlaceholderText } = render(<DevotionalScreen />);

    expect(getByText('Qual tema você gostaria de refletir hoje?')).toBeTruthy();
    expect(getByPlaceholderText('ex: paciência, perdão, confiança, esperança...')).toBeTruthy();
    expect(getByText('Gerar Devocional')).toBeTruthy();
  });

  it('deve validar o campo de tema como obrigatório', async () => {
    const { getByText } = render(<DevotionalScreen />);

    // Tenta submeter o formulário sem preencher o tema
    fireEvent.press(getByText('Gerar Devocional'));

    await waitFor(() => {
      expect(getByText('Por favor, digite um tema para o devocional')).toBeTruthy();
    });
  });

  it('deve gerar um devocional quando o formulário for submetido com tema válido', async () => {
    const { getByText, getByPlaceholderText } = render(<DevotionalScreen />);

    // Preenche o campo de tema
    fireEvent.changeText(
      getByPlaceholderText('ex: paciência, perdão, confiança, esperança...'),
      'esperança'
    );

    // Submete o formulário
    fireEvent.press(getByText('Gerar Devocional'));

    // Não podemos testar facilmente o loading state, mas podemos verificar as chamadas aos mocks
    await waitFor(() => {
      const generateDevotional = require('@/services/aiService').generateDevotional;
      const saveDevotionalToHistory = require('@/services/devotionalService').saveDevotionalToHistory;

      expect(generateDevotional).toHaveBeenCalledWith('esperança');
      expect(saveDevotionalToHistory).toHaveBeenCalledWith(
        'Devocional de Teste',
        'Conteúdo do devocional gerado para teste',
        'esperança'
      );
      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/devotional-result',
        params: {
          content: 'Conteúdo do devocional gerado para teste',
          title: 'Devocional de Teste',
          theme: 'esperança',
          fromHistory: 'true'
        }
      });
    });
  });
}); 
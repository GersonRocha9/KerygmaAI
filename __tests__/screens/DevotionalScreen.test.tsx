import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Keyboard } from 'react-native';

// Mock de useRouter
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock do keyboard
jest.spyOn(Keyboard, 'dismiss').mockImplementation(() => true);

// Mock de useLanguage
jest.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'devotional.questionPrompt': 'Qual tema você gostaria de refletir hoje?',
        'devotional.themePlaceholder': 'ex: paciência, perdão, confiança, esperança...',
        'devotional.generateButton': 'Gerar Devocional',
        'devotional.themeError': 'Por favor, digite um tema para o devocional',
        'devotional.disclaimer': 'Os devocionais são gerados por IA e podem conter imprecisões.',
        'devotional.howToUseDescription': 'Escolha um tema e receba um devocional personalizado.',
        'common.appName': 'Kerygma AI',
        'devotional.noContentError': 'Não foi possível gerar o conteúdo do devocional.',
        'devotional.apiError': 'Erro ao comunicar com a API.',
      };
      return translations[key] || key;
    },
    isEnglish: false,
    currentLanguage: 'pt',
  }),
}));

// Mock dos serviços de API
jest.mock('@/services/aiService', () => ({
  generateDevotional: jest.fn(() => Promise.resolve({
    title: 'Devocional de Teste',
    content: 'Conteúdo do devocional gerado para teste',
  })),
}));

jest.mock('@/services/devotionalService', () => ({
  saveDevotionalToHistory: jest.fn(() => Promise.resolve(true)),
}));

// Mock dos hooks de tema
jest.mock('@/hooks/useTheme', () => ({
  useThemeColors: () => ({
    primary: '#4CAF50',
    surface: '#FFFFFF',
    border: '#CCCCCC',
    error: '#B00020',
    textPrimary: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    surfaceVariant: '#F5F5F5',
    info: '#2196F3',
  }),
  useThemeSpacing: () => ({
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  }),
  useThemeBorderRadius: () => ({
    sm: 4,
    md: 8,
    lg: 12,
  }),
  useThemeTypography: () => ({
    fontFamily: {
      regular: 'Inter-Regular',
      medium: 'Inter-Medium',
      semiBold: 'Inter-SemiBold',
      bold: 'Inter-Bold',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    lineHeight: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 28,
      xl: 32,
    }
  }),
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

      expect(generateDevotional).toHaveBeenCalledWith('esperança', false);
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
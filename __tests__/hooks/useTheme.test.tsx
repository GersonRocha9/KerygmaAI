import { useTheme, useThemeBorderRadius, useThemeColors, useThemeSpacing } from '@/hooks/useTheme';
import { renderHook } from '@testing-library/react-native';

// Mock do useColorScheme
jest.mock('react-native', () => {
  const original = jest.requireActual('react-native');
  return {
    ...original,
    // Inicialmente definimos para 'light'
    useColorScheme: jest.fn(() => 'light'),
  };
});

// Mock do objeto de tema
jest.mock('@/constants/theme', () => ({
  theme: {
    light: {
      colors: {
        primary: '#4CAF50',
        background: '#FFFFFF',
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
      },
      borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
      },
      elevation: {
        sm: 1,
        md: 2,
      },
      typography: {
        fonts: {
          regular: 'InterRegular',
        },
        sizes: {
          md: 16,
        },
        lineHeights: {
          md: 24,
        },
      },
    },
    dark: {
      colors: {
        primary: '#66BB6A',
        background: '#121212',
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
      },
      borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
      },
      elevation: {
        sm: 1,
        md: 2,
      },
      typography: {
        fonts: {
          regular: 'InterRegular',
        },
        sizes: {
          md: 16,
        },
        lineHeights: {
          md: 24,
        },
      },
    },
  },
}));

describe('Theme Hooks', () => {
  it('useTheme deve retornar um objeto de tema válido', () => {
    const { result } = renderHook(() => useTheme());

    // Verificamos se o resultado tem as propriedades esperadas
    expect(result.current).toHaveProperty('colors');
    expect(result.current).toHaveProperty('spacing');
    expect(result.current).toHaveProperty('borderRadius');
    expect(result.current).toHaveProperty('elevation');
    expect(result.current).toHaveProperty('typography');
  });

  it('useThemeColors deve retornar as cores do tema', () => {
    const { result } = renderHook(() => useThemeColors());

    // Verificar se temos as cores principais
    expect(result.current).toHaveProperty('primary');
    expect(result.current).toHaveProperty('secondary');
    expect(result.current).toHaveProperty('surface');
    expect(result.current).toHaveProperty('textPrimary');
  });

  it('useThemeSpacing deve retornar os espaçamentos do tema', () => {
    const { result } = renderHook(() => useThemeSpacing());

    // Verificar se temos os espaçamentos
    expect(result.current).toHaveProperty('xs');
    expect(result.current).toHaveProperty('sm');
    expect(result.current).toHaveProperty('md');
  });

  it('useThemeBorderRadius deve retornar os border radius do tema', () => {
    const { result } = renderHook(() => useThemeBorderRadius());

    // Verificar se temos os border radius
    expect(result.current).toHaveProperty('sm');
    expect(result.current).toHaveProperty('md');
    expect(result.current).toHaveProperty('lg');
  });
}); 
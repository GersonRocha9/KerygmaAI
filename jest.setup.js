// Import matchers from testing library
import '@testing-library/react-native';

// Mock expo-font
jest.mock('expo-font');

// Mock expo-asset
jest.mock('expo-asset');

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => { };
  return Reanimated;
});

// Mock useColorScheme
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.useColorScheme = () => 'light';
  return RN;
});

// Mock the safe area context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaView: jest.fn(({ children }) => children),
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useLocalSearchParams: jest.fn(() => ({})),
  Stack: {
    Screen: jest.fn(({ children }) => children),
  },
}));

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((callback) => {
    // Executamos o callback imediatamente para simular o efeito
    callback();
  }),
}));

// Mock useTheme hooks
jest.mock('@/hooks/useTheme', () => ({
  useTheme: jest.fn(() => ({
    colors: {
      primary: '#4CAF50',
      secondary: '#2196F3',
      accent: '#FFB74D',
      surface: '#FFFFFF',
      surfaceVariant: '#F5F5F5',
      card: '#FFFFFF',
      cardVariant: '#F5F5F5',
      textPrimary: '#000000',
      textSecondary: '#666666',
      textTertiary: '#999999',
      border: 'rgba(0, 0, 0, 0.1)',
      shadow: 'rgba(0, 0, 0, 0.1)',
      error: '#B00020',
      info: '#2196F3',
      warning: '#FFB74D',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      round: 9999,
    },
    elevation: {
      sm: 1,
      md: 2,
      lg: 4,
      xl: 8,
    },
    typography: {
      fonts: {
        regular: 'InterRegular',
        medium: 'InterMedium',
        semiBold: 'InterSemiBold',
        bold: 'InterBold',
      },
      sizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
      },
      lineHeights: {
        xs: 16,
        sm: 20,
        md: 24,
        lg: 28,
        xl: 32,
        xxl: 36,
      },
    },
  })),
  useThemeColors: jest.fn(() => ({
    primary: '#4CAF50',
    secondary: '#2196F3',
    accent: '#FFB74D',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    card: '#FFFFFF',
    cardVariant: '#F5F5F5',
    textPrimary: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: 'rgba(0, 0, 0, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    error: '#B00020',
    info: '#2196F3',
    warning: '#FFB74D',
  })),
  useThemeSpacing: jest.fn(() => ({
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  })),
  useThemeBorderRadius: jest.fn(() => ({
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  })),
  useThemeElevation: jest.fn(() => ({
    sm: 1,
    md: 2,
    lg: 4,
    xl: 8,
  })),
  useThemeTypography: jest.fn(() => ({
    fonts: {
      regular: 'InterRegular',
      medium: 'InterMedium',
      semiBold: 'InterSemiBold',
      bold: 'InterBold',
    },
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
    lineHeights: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 28,
      xl: 32,
      xxl: 36,
    },
  })),
}));

// Mock useThemeColor
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn((props, colorName) => {
    if (props?.light) return props.light;
    if (props?.dark) return props.dark;
    return '#000000';
  }),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => {
  return {
    shouldUseNativeDriver: () => false,
  };
}, { virtual: true });

// Mock do IconSymbol para retornar um componente React válido
jest.mock('@/components/ui/IconSymbol', () => {
  const React = require('react');
  return {
    IconSymbol: ({ size, name, color, style }) => {
      return React.createElement('View', {
        testID: `icon-${name}`,
        style: [{ width: size, height: size }, style],
        children: React.createElement('Text', { style: { color } }, name),
      });
    }
  };
});

// Avoid error about fontFamily being a required style prop
jest.mock('@/constants/Fonts', () => ({
  Fonts: {
    regular: 'InterRegular',
    medium: 'InterMedium',
    semiBold: 'InterSemiBold',
    bold: 'InterBold',
  },
  FontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  LineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
  },
})); 
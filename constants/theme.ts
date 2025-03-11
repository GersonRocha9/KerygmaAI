import { Colors } from './Colors'
import { FontSizes, Fonts, LineHeights } from './Fonts'

export const theme = {
  light: {
    colors: {
      ...Colors.light,
      primary: '#4CAF50',
      secondary: '#2196F3',
      accent: '#FFB74D',
      surface: '#FFFFFF',
      surfaceVariant: '#F5F5F5',
      error: '#B00020',
      success: '#4CAF50',
      warning: '#FFB74D',
      info: '#2196F3',
      border: 'rgba(0, 0, 0, 0.1)',
      shadow: 'rgba(0, 0, 0, 0.1)',
      overlay: 'rgba(0, 0, 0, 0.5)',
      card: '#FFFFFF',
      cardVariant: '#F5F5F5',
      textPrimary: '#11181C',
      textSecondary: '#687076',
      textTertiary: '#9BA1A6',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      round: 9999,
    },
    elevation: {
      none: 0,
      sm: 1,
      md: 2,
      lg: 4,
      xl: 8,
    },
    typography: {
      fonts: Fonts,
      sizes: FontSizes,
      lineHeights: LineHeights,
    },
  },
  dark: {
    colors: {
      ...Colors.dark,
      primary: '#66BB6A',
      secondary: '#64B5F6',
      accent: '#FFD54F',
      surface: '#121212',
      surfaceVariant: '#1E1E1E',
      error: '#CF6679',
      success: '#66BB6A',
      warning: '#FFD54F',
      info: '#64B5F6',
      border: 'rgba(255, 255, 255, 0.12)',
      shadow: 'rgba(0, 0, 0, 0.5)',
      overlay: 'rgba(0, 0, 0, 0.8)',
      card: '#1E1E1E',
      cardVariant: '#2C2C2C',
      textPrimary: '#FFFFFF',
      textSecondary: '#E0E0E0',
      textTertiary: '#BDBDBD',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      round: 9999,
    },
    elevation: {
      none: 0,
      sm: 1,
      md: 2,
      lg: 4,
      xl: 8,
    },
    typography: {
      fonts: Fonts,
      sizes: FontSizes,
      lineHeights: LineHeights,
    },
  },
} as const

export type Theme = typeof theme.light
export type ThemeColors = Theme['colors']
export type ThemeSpacing = Theme['spacing']
export type ThemeBorderRadius = Theme['borderRadius']
export type ThemeElevation = Theme['elevation']
export type ThemeTypography = Theme['typography']

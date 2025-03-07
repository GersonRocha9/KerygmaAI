import { theme } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export function useTheme() {
  const colorScheme = useColorScheme() ?? 'light';
  return theme[colorScheme];
}

export function useThemeColors() {
  const theme = useTheme();
  return theme.colors;
}

export function useThemeSpacing() {
  const theme = useTheme();
  return theme.spacing;
}

export function useThemeBorderRadius() {
  const theme = useTheme();
  return theme.borderRadius;
}

export function useThemeElevation() {
  const theme = useTheme();
  return theme.elevation;
}

export function useThemeTypography() {
  const theme = useTheme();
  return theme.typography;
} 
import { useThemeColors } from '@/hooks/useTheme'
import { View, type ViewProps } from 'react-native'

import { useThemeColor } from '@/hooks/useThemeColor'

export type ThemedViewProps = ViewProps & {
  lightColor?: string
  darkColor?: string
  variant?: 'surface' | 'surfaceVariant' | 'card' | 'cardVariant'
}

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = 'surface',
  ...otherProps
}: ThemedViewProps) {
  const colors = useThemeColors()
  const backgroundColor = variant
    ? colors[variant]
    : useThemeColor({ light: lightColor, dark: darkColor }, 'background')

  return <View style={[{ backgroundColor }, style]} {...otherProps} />
}

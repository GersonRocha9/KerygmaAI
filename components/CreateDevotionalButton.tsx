import { useLanguage } from '@/hooks/useLanguage'
import {
  useThemeBorderRadius,
  useThemeColors,
  useThemeElevation,
  useThemeSpacing,
} from '@/hooks/useTheme'
import React from 'react'
import { Platform, StyleSheet, TouchableOpacity } from 'react-native'
import { ThemedText } from './ThemedText'
import { IconSymbol } from './ui/IconSymbol'

type CreateDevotionalButtonProps = {
  onPress: () => void
}

export function CreateDevotionalButton({
  onPress,
}: CreateDevotionalButtonProps) {
  const colors = useThemeColors()
  const spacing = useThemeSpacing()
  const borderRadius = useThemeBorderRadius()
  const elevation = useThemeElevation()
  const { t } = useLanguage()

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.container,
        {
          backgroundColor: colors.primary,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
          marginBottom: spacing.lg,
          ...Platform.select({
            ios: {
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: elevation.sm },
              shadowOpacity: 0.25,
              shadowRadius: elevation.md,
            },
            android: {
              elevation: elevation.md,
            },
          }),
        },
      ]}
    >
      <IconSymbol
        size={24}
        name="plus.circle.fill"
        color="#FFFFFF"
        style={{ marginRight: spacing.sm }}
      />
      <ThemedText
        style={[
          styles.text,
          {
            color: '#FFFFFF',
          },
        ]}
      >
        {t('home.createNewDevotional')}
      </ThemedText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
})

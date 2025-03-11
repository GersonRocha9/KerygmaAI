import {
  useThemeBorderRadius,
  useThemeColors,
  useThemeElevation,
  useThemeSpacing,
} from '@/hooks/useTheme'
import React from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ThemedText } from './ThemedText'
import { ThemedView } from './ThemedView'
import { IconSymbol } from './ui/IconSymbol'

type DevotionalListItemProps = {
  title: string
  theme: string
  date: string
  onPress: () => void
}

export function DevotionalListItem({
  title,
  theme,
  date,
  onPress,
}: DevotionalListItemProps) {
  const colors = useThemeColors()
  const spacing = useThemeSpacing()
  const borderRadius = useThemeBorderRadius()
  const elevation = useThemeElevation()

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <ThemedView
        variant="card"
        style={[
          styles.container,
          {
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginBottom: spacing.sm,
            ...Platform.select({
              ios: {
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: elevation.sm },
                shadowOpacity: 0.1,
                shadowRadius: elevation.sm,
              },
              android: {
                elevation: elevation.sm,
              },
            }),
          },
        ]}
      >
        <View style={styles.content}>
          <ThemedText
            variant="primary"
            style={[styles.title, { marginBottom: spacing.xs }]}
            numberOfLines={1}
          >
            {title}
          </ThemedText>
          <ThemedText
            variant="secondary"
            style={[styles.theme, { marginBottom: spacing.xs }]}
          >
            Tema: {theme}
          </ThemedText>
          <ThemedText variant="tertiary" style={styles.date}>
            {date}
          </ThemedText>
        </View>
        <IconSymbol
          size={20}
          name="chevron.right"
          color={colors.textTertiary}
          style={styles.icon}
        />
      </ThemedView>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  theme: {
    fontSize: 14,
  },
  date: {
    fontSize: 12,
  },
  icon: {
    alignSelf: 'center',
  },
})

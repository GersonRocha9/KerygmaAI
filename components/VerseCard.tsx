import { useThemeBorderRadius, useThemeColors, useThemeElevation, useThemeSpacing } from '@/hooks/useTheme';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

type VerseCardProps = {
  verse: string;
  reference: string;
  onShare?: () => void;
};

export function VerseCard({ verse, reference, onShare }: VerseCardProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const borderRadius = useThemeBorderRadius();
  const elevation = useThemeElevation();

  return (
    <ThemedView
      variant="card"
      style={[
        styles.container,
        {
          borderRadius: borderRadius.lg,
          padding: spacing.md,
          ...Platform.select({
            ios: {
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: elevation.sm },
              shadowOpacity: 0.2,
              shadowRadius: elevation.md,
            },
            android: {
              elevation: elevation.md,
            },
          }),
        },
      ]}
    >
      <View style={[styles.header, { marginBottom: spacing.sm }]}>
        <ThemedText variant="primary" type="title" style={styles.title}>
          {reference}
        </ThemedText>
        {onShare && (
          <TouchableOpacity onPress={onShare} style={[styles.shareButton, { padding: spacing.xs }]}>
            <IconSymbol
              size={24}
              name="square.and.arrow.up"
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
      <ThemedText
        variant="primary"
        style={[styles.verse, { marginBottom: spacing.sm }]}
      >
        {verse}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
  },
  shareButton: {
    borderRadius: 8,
  },
  verse: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  reference: {
    fontSize: 14,
    textAlign: 'right',
  },
}); 
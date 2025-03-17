import { useThemeColors } from '@/hooks/useTheme'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// This is a shim for web and Android where the tab bar is generally opaque.
export default function TabBarBackground() {
  const insets = useSafeAreaInsets()
  const colors = useThemeColors()

  // Calculate extra padding for bottom safe area
  const bottomInset = Platform.OS === 'ios' ? insets.bottom : 0

  // For iOS, use a blur effect with gradient overlay for a premium feel
  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.background, { paddingBottom: bottomInset }]}>
        <BlurView
          intensity={85}
          tint={colors.surface === '#FFFFFF' ? 'light' : 'dark'}
          style={styles.blurView}
        />
        <LinearGradient
          colors={[
            `${colors.surface}CC`,
            `${colors.surface}D9`,
            `${colors.surface}E6`,
          ]}
          style={styles.gradientOverlay}
        />
        <View style={[styles.topBorder, { backgroundColor: colors.border }]} />
      </View>
    )
  }

  // For Android, use a gradient background with elevation
  return (
    <View style={[styles.androidContainer, { paddingBottom: bottomInset }]}>
      <LinearGradient
        colors={[colors.surface, colors.surfaceVariant]}
        style={styles.androidGradient}
      />
      <View style={[styles.topBorder, { backgroundColor: colors.border }]} />
    </View>
  )
}

// Function to calculate overflow if needed
export function useBottomTabOverflow() {
  const insets = useSafeAreaInsets()
  return Platform.OS === 'ios' ? insets.bottom : 0
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 49,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  androidContainer: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  androidGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})

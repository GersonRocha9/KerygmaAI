import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// This is a shim for web and Android where the tab bar is generally opaque.
export default function TabBarBackground() {
  const insets = useSafeAreaInsets();

  // Calculate extra padding for bottom safe area
  const bottomInset = Platform.OS === 'ios' ? insets.bottom : 0;

  // For iOS, use a blur effect with gradient overlay for a premium feel
  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.background, { paddingBottom: bottomInset }]}>
        <BlurView
          intensity={85}
          tint="light"
          style={styles.blurView}
        />
        <LinearGradient
          colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.85)', 'rgba(255,255,255,0.9)']}
          style={styles.gradientOverlay}
        />
        <View style={styles.topBorder} />
      </View>
    );
  }

  // For Android, use a gradient background with elevation
  return (
    <View
      style={[
        styles.background,
        styles.androidContainer,
        { paddingBottom: bottomInset }
      ]}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FA']}
        style={styles.androidGradient}
      />
      <View style={styles.topBorder} />
    </View>
  );
}

// Function to calculate overflow if needed
export function useBottomTabOverflow() {
  const insets = useSafeAreaInsets();
  return Platform.OS === 'ios' ? insets.bottom : 0;
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    opacity: 0.7,
  },
  androidContainer: {
    backgroundColor: '#FFFFFF',
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  androidGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(0,0,0,0.06)' : '#E0E0E0',
    zIndex: 3,
  }
});

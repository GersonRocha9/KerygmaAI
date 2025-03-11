import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'
import { PlatformPressable } from '@react-navigation/elements'
import * as Haptics from 'expo-haptics'
import React, { useCallback, useRef } from 'react'
import { Animated, Platform, StyleSheet, View } from 'react-native'

export function HapticTab(props: BottomTabBarButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current
  const isActive = props.accessibilityState?.selected

  const handlePressIn = useCallback(
    (ev: any) => {
      Animated.spring(scaleAnim, {
        toValue: 0.92,
        friction: 5,
        tension: 300,
        useNativeDriver: true,
      }).start()

      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }

      props.onPressIn?.(ev)
    },
    [props, scaleAnim]
  )

  const handlePressOut = useCallback(
    (ev: any) => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 300,
        useNativeDriver: true,
      }).start()

      props.onPressOut?.(ev)
    },
    [props, scaleAnim]
  )

  return (
    <View style={styles.container}>
      {isActive && <View style={styles.activeBackground} />}
      <PlatformPressable
        {...props}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={{
          color: 'rgba(0, 0, 0, 0.08)',
          borderless: true,
          foreground: true,
        }}
      >
        <Animated.View
          style={[styles.content, { transform: [{ scale: scaleAnim }] }]}
        >
          {props.children}
        </Animated.View>
      </PlatformPressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor:
      Platform.OS === 'ios'
        ? 'rgba(76, 175, 80, 0.12)'
        : 'rgba(76, 175, 80, 0.05)',
    marginVertical: 6,
    marginHorizontal: 6,
    borderRadius: 12,
    zIndex: -1,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    width: '100%',
  },
})

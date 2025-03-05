// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle, ViewStyle } from 'react-native';

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'square.and.arrow.up': 'share',
  'book.fill': 'book',
  'plus.circle.fill': 'add-circle',
  'clock.fill': 'access-time',
  'lightbulb.fill': 'lightbulb',
  'info.circle.fill': 'info',
  'heart.fill': 'favorite',
  'book.closed.fill': 'menu-book',
  'quote.opening': 'format-quote',
  'arrow.right': 'arrow-forward',
  'arrow.left': 'arrow-back',
  'trash.fill': 'delete',
  'trash': 'delete-outline',
  'xmark.circle.fill': 'cancel',
  'sparkles': 'auto-awesome',
  'wand.and.stars': 'auto-fix-high',
  'wand.and.star': 'auto-fix-normal',
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialIcons>['name']
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  // Get the mapped Material icon name or use a fallback
  const iconName = MAPPING[name] || 'help-outline'; // Add a fallback icon if mapping is missing

  return <MaterialIcons color={color} size={size} name={iconName} style={style as StyleProp<TextStyle>} />;
}

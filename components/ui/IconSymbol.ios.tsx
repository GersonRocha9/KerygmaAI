import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import type { SymbolWeight } from 'expo-symbols'
import type React from 'react'
import type {
  OpaqueColorValue,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'

// Mapeamento dos ícones SF Symbol para MaterialIcons
const MAPPING = {
  // Ver MaterialIcons aqui: https://icons.expo.fyi
  // Ver SF Symbols no app SF Symbols no Mac.
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
  trash: 'delete-outline',
  'xmark.circle.fill': 'cancel',
  sparkles: 'auto-awesome',
  'wand.and.stars': 'auto-fix-high',
  'wand.and.star': 'auto-fix-normal',
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialIcons>['name']
  >
>

export type IconSymbolName = keyof typeof MAPPING

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: IconSymbolName
  size?: number
  color: string | OpaqueColorValue
  style?: StyleProp<ViewStyle>
  weight?: SymbolWeight
}) {
  // Obter o nome do ícone do Material ou usar um fallback
  const iconName = MAPPING[name] || 'help-outline'

  return (
    <MaterialIcons
      color={color}
      size={size}
      name={iconName}
      style={style as StyleProp<TextStyle>}
    />
  )
}

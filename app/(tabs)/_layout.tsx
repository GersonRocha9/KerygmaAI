import { Tabs } from 'expo-router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Dimensions, Platform, StyleSheet, View } from 'react-native'

import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import TabBarBackground from '@/components/ui/TabBarBackground'

export default function TabLayout() {
  const { width } = Dimensions.get('window')
  const isSmallDevice = width < 375

  const animatedValue = useRef(new Animated.Value(0)).current
  const [tabWidth, setTabWidth] = useState(width / 2)
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const handleTabPress = (index: number) => {
    setActiveTabIndex(index)
    animateIndicator(index)
  }

  const animateIndicator = (index: number) => {
    Animated.spring(animatedValue, {
      toValue: index * tabWidth,
      tension: 180,
      friction: 25,
      useNativeDriver: true,
    }).start()
  }

  useEffect(() => {
    // Animar quando o tamanho da tab ou o índice ativo muda
    animateIndicator(activeTabIndex)
  }, [tabWidth, activeTabIndex])

  const primaryColor = '#4CAF50'
  const inactiveColor = Platform.OS === 'ios' ? '#8E8E93' : '#757575'

  // Renderizar a barra de tabs personalizada
  const renderTabBar = useMemo(() => {
    return (props: any) => {
      // Calcular a largura da tab com base no número de rotas
      const routesCount = props.state.routes.length
      if (routesCount > 0 && width / routesCount !== tabWidth) {
        // Usar setTimeout para evitar atualização durante renderização
        setTimeout(() => {
          setTabWidth(width / routesCount)
        }, 0)
      }

      // Sincronizar o índice ativo com o estado de navegação
      if (props.state.index !== activeTabIndex) {
        // Usar setTimeout para evitar atualização durante renderização
        setTimeout(() => {
          setActiveTabIndex(props.state.index)
        }, 0)
      }

      return (
        <View style={styles.tabBarContainer}>
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                transform: [{ translateX: animatedValue }],
                width: tabWidth,
              },
            ]}
          />

          <TabBarBackground />

          <View style={styles.tabBar}>
            {props.state.routes.map((route: any, index: number) => {
              const isFocused = props.state.index === index
              const onPress = () => {
                handleTabPress(index)
                props.navigation.navigate(route.name)
              }

              return (
                <HapticTab
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  onPress={onPress}
                  style={styles.tab}
                >
                  {props.descriptors[route.key].options.tabBarIcon({
                    color: isFocused ? primaryColor : inactiveColor,
                  })}
                  <Animated.Text
                    style={[
                      styles.tabText,
                      {
                        color: isFocused ? primaryColor : inactiveColor,
                      },
                    ]}
                  >
                    {route.name === 'index'
                      ? 'Início'
                      : route.name === 'devotional'
                        ? 'Devocional'
                        : route.name.charAt(0).toUpperCase() +
                          route.name.slice(1)}
                  </Animated.Text>
                </HapticTab>
              )
            })}
          </View>
        </View>
      )
    }
  }, [
    width,
    activeTabIndex,
    animatedValue,
    tabWidth,
    primaryColor,
    inactiveColor,
  ])

  return (
    <Tabs
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={isSmallDevice ? 24 : 26}
              name="house.fill"
              color={color}
              style={styles.icon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="devotional"
        options={{
          title: 'Devocional',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={isSmallDevice ? 24 : 26}
              name="book.fill"
              color={color}
              style={styles.icon}
            />
          ),
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: 2,
  },
  tabBarContainer: {
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 0,
    position: 'relative',
    backgroundColor: Platform.OS === 'android' ? '#FFFFFF' : 'transparent',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  tabBar: {
    flexDirection: 'row',
    height: '100%',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  tabIndicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    backgroundColor: '#4CAF50',
    zIndex: 1,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
})

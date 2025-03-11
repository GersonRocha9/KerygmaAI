import { DevotionalListItem } from '@/components/DevotionalListItem'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { useLanguage } from '@/hooks/useLanguage'
import {
  useThemeBorderRadius,
  useThemeColors,
  useThemeSpacing,
} from '@/hooks/useTheme'
import {
  type DevotionalHistory,
  clearDevotionalHistory,
  loadDevotionalHistory,
} from '@/services/devotionalService'
import { Stack, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

export default function HistoryScreen() {
  const router = useRouter()
  const colors = useThemeColors()
  const spacing = useThemeSpacing()
  const borderRadius = useThemeBorderRadius()
  const [loading, setLoading] = useState(true)
  const [devotionalHistory, setDevotionalHistory] = useState<
    DevotionalHistory[]
  >([])
  const { t } = useLanguage()

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const history = await loadDevotionalHistory()
      setDevotionalHistory(history)
    } catch (error) {
      console.error('Erro ao carregar histórico de devocionais:', error)
    } finally {
      setLoading(false)
    }
  }

  const openDevotionalResult = (item: DevotionalHistory) => {
    router.push({
      pathname: '/devotional-result',
      params: {
        title: item.title,
        content: item.content,
        theme: item.theme,
        fromHistory: 'true',
      },
    })
  }

  const handleClearHistory = () => {
    Alert.alert(t('history.clearHistory'), t('history.clearConfirmation'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('common.clear'),
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true)
            const success = await clearDevotionalHistory()
            if (success) {
              setDevotionalHistory([])
            } else {
              Alert.alert(t('common.error'), t('history.clearError'))
            }
          } catch (error) {
            console.error('Erro ao limpar histórico:', error)
            Alert.alert(t('common.error'), t('history.errorMessage'))
          } finally {
            setLoading(false)
          }
        },
      },
    ])
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: t('history.title'),
          headerTintColor: colors.primary,
          headerTitleStyle: {
            color: colors.primary,
            fontWeight: 'bold',
          },
          headerBackTitle: t('common.back'),
        }}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing.md }]}
      >
        <View style={[styles.headerContainer, { marginBottom: spacing.md }]}>
          <View style={styles.titleContainer}>
            <IconSymbol
              size={24}
              name="clock.fill"
              color={colors.primary}
              style={{ marginRight: spacing.sm }}
            />
            <ThemedText variant="primary" type="subtitle">
              {t('history.yourDevotionals')}
            </ThemedText>
          </View>
          {devotionalHistory.length > 0 && (
            <TouchableOpacity
              style={{ padding: spacing.sm }}
              onPress={handleClearHistory}
            >
              <IconSymbol size={22} name="trash.fill" color={colors.error} />
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: spacing.xl }}
          />
        ) : devotionalHistory.length > 0 ? (
          <View style={styles.historyList}>
            {devotionalHistory.map(item => (
              <DevotionalListItem
                key={item.id}
                title={item.title}
                theme={item.theme}
                date={item.date}
                onPress={() => openDevotionalResult(item)}
              />
            ))}
          </View>
        ) : (
          <ThemedView
            variant="cardVariant"
            style={[
              styles.emptyState,
              {
                padding: spacing.xl,
                marginTop: spacing.xl,
                borderRadius: borderRadius.lg,
              },
            ]}
          >
            <IconSymbol
              size={40}
              name="book.closed.fill"
              color={colors.textTertiary}
              style={{ marginBottom: spacing.md }}
            />
            <ThemedText
              variant="primary"
              style={[styles.emptyText, { marginBottom: spacing.sm }]}
            >
              {t('history.emptyTitle')}
            </ThemedText>
            <ThemedText variant="tertiary" style={styles.emptySubtext}>
              {t('history.emptyDescription')}
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
})

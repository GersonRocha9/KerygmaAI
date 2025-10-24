import { CreateDevotionalButton } from '@/src/components/CreateDevotionalButton'
import { DevotionalListItem } from '@/src/components/DevotionalListItem'
import { ThemedText } from '@/src/components/ThemedText'
import { ThemedView } from '@/src/components/ThemedView'
import { VerseCard } from '@/src/components/VerseCard'
import { IconSymbol } from '@/src/components/ui/IconSymbol'
import { useTranslatedVerseOfTheDay } from '@/src/hooks/queries/useVerseOfTheDay'
import { useLanguage } from '@/src/hooks/useLanguage'
import { useThemeColors, useThemeSpacing } from '@/src/hooks/useTheme'
import {
  type DevotionalHistory,
  loadRecentDevotionals,
} from '@/src/services/devotionalService'
import { shareVerse } from '@/src/services/shareService'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const router = useRouter()
  const colors = useThemeColors()
  const spacing = useThemeSpacing()
  const { t, toggleLanguage, isEnglish } = useLanguage()
  const [devotionalHistory, setDevotionalHistory] = useState<
    DevotionalHistory[]
  >([])
  const [loading, setLoading] = useState(true)

  const handleCreateDevotional = () => {
    router.push('/devotional')
  }

  const { data: translatedVerse, isLoading: verseLoading } =
    useTranslatedVerseOfTheDay()

  useFocusEffect(
    useCallback(() => {
      const loadDevotionalHistory = async () => {
        try {
          setLoading(true)
          const recentDevotionals = await loadRecentDevotionals(3)
          setDevotionalHistory(recentDevotionals)
        } catch (error) {
          console.error('Erro ao carregar histórico de devocionais:', error)
        } finally {
          setLoading(false)
        }
      }

      void loadDevotionalHistory()
    }, [])
  )

  const handleOpenDevotional = (item: DevotionalHistory) => {
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

  const handleViewAll = () => {
    router.push('/history')
  }

  const handleShareVerse = async () => {
    if (translatedVerse) {
      await shareVerse(translatedVerse.text, translatedVerse.reference)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ padding: spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { marginBottom: spacing.md }]}>
          <View style={styles.headerLeft}>
            <IconSymbol
              size={26}
              name="book.fill"
              color={colors.primary}
              style={{ marginRight: spacing.sm }}
            />
            <ThemedText type="title">{t('common.appName')}</ThemedText>
          </View>
          <Pressable
            onPress={toggleLanguage}
            style={({ pressed }) => [
              styles.languageButton,
              {
                borderColor: colors.primary,
                backgroundColor: pressed
                  ? `${colors.primary}15`
                  : 'transparent',
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <ThemedText
              style={[styles.languageButtonText, { color: colors.primary }]}
            >
              {isEnglish ? '🇺🇸 EN' : '🇧🇷 PT'}
            </ThemedText>
          </Pressable>
        </View>

        {verseLoading ? (
          <ThemedView
            variant="card"
            style={[
              styles.loadingContainer,
              {
                padding: spacing.md,
                borderRadius: 12,
                marginBottom: spacing.lg,
              },
            ]}
          >
            <ActivityIndicator size="small" color={colors.primary} />
          </ThemedView>
        ) : translatedVerse ? (
          <VerseCard
            verse={translatedVerse.text}
            reference={translatedVerse.reference}
            onShare={handleShareVerse}
          />
        ) : null}

        <CreateDevotionalButton onPress={handleCreateDevotional} />

        <View style={[styles.recentSection, { marginBottom: spacing.xl }]}>
          <View style={[styles.sectionHeader, { marginBottom: spacing.sm }]}>
            <ThemedText type="subtitle">
              {t('home.recentDevotionals')}
            </ThemedText>
            <TouchableOpacity
              onPress={handleViewAll}
              style={[styles.viewAllButton, { marginLeft: spacing.sm }]}
            >
              {devotionalHistory.length > 0 && (
                <>
                  <ThemedText
                    variant="primary"
                    style={[
                      styles.viewAllText,
                      { color: colors.primary, marginRight: spacing.xs },
                    ]}
                  >
                    {t('home.viewAll')}
                  </ThemedText>
                  <IconSymbol
                    name="arrow.right"
                    size={16}
                    color={colors.primary}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : devotionalHistory.length > 0 ? (
            <View style={styles.historyList}>
              {devotionalHistory.map(item => (
                <DevotionalListItem
                  key={item.id}
                  title={item.title}
                  theme={item.theme}
                  date={item.date}
                  onPress={() => handleOpenDevotional(item)}
                />
              ))}
            </View>
          ) : (
            <ThemedText variant="secondary" style={styles.noHistoryText}>
              {t('home.noDevotionals')}
            </ThemedText>
          )}
        </View>

        <ThemedView
          variant="cardVariant"
          style={[
            styles.infoCard,
            {
              borderRadius: 12,
              padding: spacing.md,
              marginBottom: spacing.lg,
            },
          ]}
        >
          <IconSymbol
            size={24}
            name="lightbulb.fill"
            color={colors.warning}
            style={{ marginRight: spacing.sm }}
          />
          <View style={styles.infoContent}>
            <ThemedText variant="primary" style={styles.infoTitle}>
              {t('home.howToUse')}
            </ThemedText>
            <ThemedText variant="secondary" style={styles.infoText}>
              {t('home.howToUseDescription')}
            </ThemedText>
          </View>
        </ThemedView>

        <View
          style={[styles.disclaimerContainer, { marginBottom: spacing.xl }]}
        >
          <IconSymbol
            size={20}
            name="info.circle.fill"
            color={colors.info}
            style={{ marginRight: spacing.sm }}
          />
          <ThemedText variant="tertiary" style={styles.disclaimerText}>
            {t('home.disclaimer')}
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    elevation: 0,
    shadowColor: 'transparent',
  },
  languageButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  recentSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  historyList: {
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  noHistoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
})

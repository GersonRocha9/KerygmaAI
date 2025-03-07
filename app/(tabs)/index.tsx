import { CreateDevotionalButton } from '@/components/CreateDevotionalButton';
import { DevotionalListItem } from '@/components/DevotionalListItem';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { VerseCard } from '@/components/VerseCard';
import { useTranslatedVerseOfTheDay } from '@/hooks/queries/useVerseOfTheDay';
import { useThemeColors, useThemeSpacing } from '@/hooks/useTheme';
import { loadRecentDevotionals, type DevotionalHistory } from '@/services/devotionalService';
import { shareVerse } from '@/services/shareService';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [devotionalHistory, setDevotionalHistory] = useState<DevotionalHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCreateDevotional = () => {
    router.push('/devotional');
  };

  const { data: translatedVerse, isLoading: verseLoading } = useTranslatedVerseOfTheDay();

  const loadDevotionalHistory = async () => {
    try {
      setLoading(true);
      const recentDevotionals = await loadRecentDevotionals(3);
      setDevotionalHistory(recentDevotionals);
    } catch (error) {
      console.error("Erro ao carregar histórico de devocionais:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDevotionalHistory();
    }, [])
  );

  const handleOpenDevotional = (item: DevotionalHistory) => {
    router.push({
      pathname: '/devotional-result',
      params: {
        title: item.title,
        content: item.content,
        theme: item.theme,
        fromHistory: 'true'
      }
    });
  };

  const handleViewAll = () => {
    router.push('/history');
  };

  const handleShareVerse = async () => {
    if (translatedVerse) {
      await shareVerse(translatedVerse.text, translatedVerse.reference);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent} contentContainerStyle={{ padding: spacing.md }}>
        <View style={[styles.header, { marginBottom: spacing.md }]}>
          <IconSymbol
            size={26}
            name="book.fill"
            color={colors.primary}
            style={{ marginRight: spacing.sm }}
          />
          <ThemedText type="title">KerygmaAI</ThemedText>
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
              Devocionais Recentes
            </ThemedText>
            <TouchableOpacity
              onPress={handleViewAll}
              style={[styles.viewAllButton, { marginLeft: spacing.sm }]}
            >
              {devotionalHistory.length > 0 && (
                <>
                  <ThemedText
                    variant="primary"
                    style={[styles.viewAllText, { color: colors.primary, marginRight: spacing.xs }]}
                  >
                    Ver Todos
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
              {devotionalHistory.map((item) => (
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
              Nenhuma devocional recente encontrada.
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
              Como utilizar o aplicativo
            </ThemedText>
            <ThemedText variant="secondary" style={styles.infoText}>
              Acesse a aba Devocional, digite um tema de seu interesse e receba um devocional personalizado baseado em passagens bíblicas.
            </ThemedText>
          </View>
        </ThemedView>

        <View style={[styles.disclaimerContainer, { marginBottom: spacing.xl }]}>
          <IconSymbol
            size={20}
            name="info.circle.fill"
            color={colors.info}
            style={{ marginRight: spacing.sm }}
          />
          <ThemedText variant="tertiary" style={styles.disclaimerText}>
            Os devocionais são gerados por inteligência artificial e servem como complemento à sua jornada espiritual. Lembre-se sempre de buscar a Palavra de Deus como fonte primária de verdade.
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
});
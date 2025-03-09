import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Fonts } from '@/constants/Fonts';
import { extractDevotionalParts, formatTitle } from '@/formatters/textFormatters';
import { useLanguage } from '@/hooks/useLanguage';
import { useThemeBorderRadius, useThemeColors, useThemeSpacing } from '@/hooks/useTheme';
import { shareDevotional } from '@/services/shareService';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DevotionalResultScreen() {
  const { title, content, theme, fromHistory } = useLocalSearchParams<{
    title: string;
    content: string;
    theme?: string;
    fromHistory?: string;
  }>();

  const [isSharing, setIsSharing] = useState(false);
  const [isSaved] = useState(fromHistory === 'true');
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const borderRadius = useThemeBorderRadius();
  const { t } = useLanguage();

  // Processar o conteúdo para exibição
  const processedTitle = formatTitle(title);
  const devotionalParts = extractDevotionalParts(content);

  // Função para compartilhar o devocional
  const handleShare = async () => {
    if (content) {
      setIsSharing(true);
      try {
        const contentToShare = `${processedTitle || t('devotionalResult.title')}\n\n${content}`;
        await shareDevotional(contentToShare, processedTitle || t('devotionalResult.title'));
      } catch (error) {
        console.error(t('devotionalResult.shareError'), error);
      } finally {
        setIsSharing(false);
      }
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: t('devotionalResult.title'),
          headerTintColor: colors.primary,
          headerTitleStyle: {
            color: colors.primary,
            fontWeight: 'bold',
          },
          headerBackTitle: t('common.back'),
          headerRight: () => (
            <TouchableOpacity
              style={styles.headerShareButton}
              onPress={handleShare}
              disabled={isSharing}
            >
              {isSharing ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <IconSymbol
                  size={24}
                  name="square.and.arrow.up"
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>
          ),
        }}
      />

      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <ScrollView style={styles.contentContainer} contentContainerStyle={[styles.scrollContent, { padding: spacing.md }]}>
          <ThemedView
            variant="cardVariant"
            style={[
              styles.devotionalContainer,
              {
                borderRadius: borderRadius.lg,
                padding: spacing.md,
              }
            ]}
          >
            {/* Título do Devocional */}
            {processedTitle && (
              <View
                style={[
                  styles.devotionalTitleContainer,
                  {
                    marginBottom: spacing.md,
                    paddingBottom: spacing.sm,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }
                ]}
              >
                <ThemedText variant="primary" style={styles.devotionalTitle}>
                  {processedTitle}
                </ThemedText>
              </View>
            )}

            {/* Conteúdo do Devocional */}
            {devotionalParts && (
              <>
                {/* Versículo */}
                {devotionalParts.verse && (
                  <ThemedView
                    variant="card"
                    style={[
                      styles.verseContainer,
                      {
                        borderRadius: borderRadius.md,
                        padding: spacing.md,
                        marginBottom: spacing.md,
                      }
                    ]}
                  >
                    <IconSymbol
                      size={20}
                      name="quote.opening"
                      color={colors.primary}
                      style={styles.quoteIcon}
                    />
                    <ThemedText variant="primary" style={styles.verseText}>
                      {devotionalParts.verse}
                    </ThemedText>
                    {devotionalParts.reference && (
                      <ThemedText
                        variant="secondary"
                        style={[styles.verseReference, { color: colors.primary }]}
                      >
                        {devotionalParts.reference}
                      </ThemedText>
                    )}
                  </ThemedView>
                )}

                {/* Introdução */}
                {devotionalParts.introducaoParagraphs.length > 0 && (
                  <>
                    <ThemedText
                      variant="primary"
                      style={[
                        styles.sectionTitle,
                        {
                          marginTop: spacing.sm,
                          marginBottom: spacing.sm,
                          borderLeftWidth: 3,
                          borderLeftColor: colors.primary,
                          paddingLeft: spacing.sm,
                        }
                      ]}
                    >
                      {t('devotionalResult.introduction')}
                    </ThemedText>
                    {devotionalParts.introducaoParagraphs.map((paragraph: string, index: number) => (
                      <ThemedText
                        key={`intro-${index}`}
                        variant="secondary"
                        style={[styles.paragraph, { marginBottom: spacing.md }]}
                      >
                        {paragraph.trim()}
                      </ThemedText>
                    ))}
                  </>
                )}

                {/* Tópicos */}
                {devotionalParts.topicos.length > 0 &&
                  devotionalParts.topicos.map((topico, topicoIndex) => (
                    <View key={`topico-${topicoIndex}`}>
                      <ThemedText
                        variant="primary"
                        style={[
                          styles.topicoTitle,
                          {
                            marginTop: spacing.md,
                            marginBottom: spacing.sm,
                            paddingBottom: spacing.xs,
                            borderBottomWidth: 1,
                            borderBottomColor: colors.border,
                          }
                        ]}
                      >
                        {topico.titulo === 'Reflection'
                          ? t('devotionalResult.reflection')
                          : topico.titulo === 'Practical Application'
                            ? t('devotionalResult.practicalApplication')
                            : topico.titulo}
                      </ThemedText>
                      {topico.paragraphs.map((paragraph: string, paragraphIndex: number) => (
                        <ThemedText
                          key={`topico-${topicoIndex}-p-${paragraphIndex}`}
                          variant="secondary"
                          style={[styles.paragraph, { marginBottom: spacing.md }]}
                        >
                          {paragraph.trim()}
                        </ThemedText>
                      ))}
                    </View>
                  ))
                }

                {/* Conclusão */}
                {devotionalParts.conclusaoParagraphs.length > 0 && (
                  <>
                    <ThemedText
                      variant="primary"
                      style={[
                        styles.sectionTitle,
                        {
                          marginTop: spacing.sm,
                          marginBottom: spacing.sm,
                          borderLeftWidth: 3,
                          borderLeftColor: colors.primary,
                          paddingLeft: spacing.sm,
                        }
                      ]}
                    >
                      {t('devotionalResult.conclusion')}
                    </ThemedText>
                    {devotionalParts.conclusaoParagraphs.map((paragraph: string, index: number) => (
                      <ThemedText
                        key={`conclusao-${index}`}
                        variant="secondary"
                        style={[styles.paragraph, { marginBottom: spacing.md }]}
                      >
                        {paragraph.trim()}
                      </ThemedText>
                    ))}
                  </>
                )}

                {/* Oração */}
                {devotionalParts.oracaoParagraphs.length > 0 && (
                  <>
                    <ThemedText
                      variant="primary"
                      style={[
                        styles.sectionTitle,
                        {
                          marginTop: spacing.sm,
                          marginBottom: spacing.sm,
                          borderLeftWidth: 3,
                          borderLeftColor: colors.primary,
                          paddingLeft: spacing.sm,
                        }
                      ]}
                    >
                      {t('devotionalResult.prayer')}
                    </ThemedText>
                    {devotionalParts.oracaoParagraphs.map((paragraph: string, index: number) => (
                      <ThemedText
                        key={`oracao-${index}`}
                        variant="secondary"
                        style={[styles.paragraph, styles.prayerText, { marginBottom: spacing.md }]}
                      >
                        {paragraph.trim()}
                      </ThemedText>
                    ))}
                  </>
                )}
              </>
            )}
          </ThemedView>

          {/* Disclaimer */}
          <View
            style={[
              styles.disclaimerContainer,
              {
                borderRadius: borderRadius.md,
                padding: spacing.sm,
                marginTop: spacing.md,
                backgroundColor: colors.surfaceVariant,
              }
            ]}
          >
            <IconSymbol
              size={18}
              name="info.circle.fill"
              color={colors.textSecondary}
              style={[styles.disclaimerIcon, { marginTop: 3 }]}
            />
            <ThemedText variant="tertiary" style={styles.disclaimerText}>
              {t('devotionalResult.disclaimer')}
            </ThemedText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerShareButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -8,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  devotionalContainer: {
    flex: 1,
  },
  devotionalTitleContainer: {
    alignItems: 'center',
  },
  devotionalTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    textAlign: 'center',
  },
  verseContainer: {
    position: 'relative',
  },
  quoteIcon: {
    position: 'absolute',
    top: 8,
    left: 8,
    opacity: 0.5,
  },
  verseText: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
  },
  verseReference: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    textAlign: 'right',
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    fontFamily: Fonts.regular,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
  },
  topicoTitle: {
    fontSize: 17,
    fontFamily: Fonts.semiBold,
  },
  prayerText: {
    fontStyle: 'italic',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  disclaimerIcon: {
    marginRight: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
}); 
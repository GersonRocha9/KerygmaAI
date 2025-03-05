import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Fonts } from '@/constants/Fonts';
import { extractDevotionalParts, formatTitle } from '@/formatters/textFormatters';
import { shareDevotional } from '@/services/shareService';

export default function DevotionalResultScreen() {
  const { title, content, theme, fromHistory } = useLocalSearchParams<{
    title: string;
    content: string;
    theme?: string;
    fromHistory?: string;
  }>();

  const [isSharing, setIsSharing] = useState(false);
  const [isSaved, setIsSaved] = useState(fromHistory === 'true');

  // Processar o conteúdo para exibição
  const processedTitle = formatTitle(title);
  const devotionalParts = extractDevotionalParts(content);

  // Função para compartilhar o devocional
  const handleShare = async () => {
    if (content) {
      setIsSharing(true);
      try {
        const contentToShare = `${processedTitle || 'Devocional'}\n\n${content}`;
        await shareDevotional(contentToShare, processedTitle || 'Devocional Diário');
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      } finally {
        setIsSharing(false);
      }
    }
  };

  return (
    <>
      {/* Configuração do header nativo */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Devocional',
          headerTintColor: '#4CAF50',
          headerTitleStyle: {
            color: '#4CAF50',
            fontWeight: 'bold',
          },
          headerBackTitle: 'Voltar',
          headerRight: () => (
            <TouchableOpacity
              style={styles.headerShareButton}
              onPress={handleShare}
              disabled={isSharing}
            >
              {isSharing ? (
                <ActivityIndicator size="small" color="#4CAF50" />
              ) : (
                <IconSymbol
                  size={24}
                  name="square.and.arrow.up"
                  color="#4CAF50"
                />
              )}
            </TouchableOpacity>
          ),
        }}
      />

      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <ScrollView style={styles.contentContainer} contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.devotionalContainer}>
            {/* Título do Devocional */}
            {processedTitle && (
              <View style={styles.devotionalTitleContainer}>
                <ThemedText style={styles.devotionalTitle}>
                  {processedTitle}
                </ThemedText>
              </View>
            )}

            {/* Conteúdo do Devocional */}
            {devotionalParts && (
              <>
                {/* Versículo */}
                {devotionalParts.verse && (
                  <View style={styles.verseContainer}>
                    <IconSymbol
                      size={20}
                      name="quote.opening"
                      color="#4CAF50"
                      style={styles.quoteIcon}
                    />
                    <ThemedText style={styles.verseText}>{devotionalParts.verse}</ThemedText>
                    {devotionalParts.reference && (
                      <ThemedText style={styles.verseReference}>{devotionalParts.reference}</ThemedText>
                    )}
                  </View>
                )}

                {/* Introdução */}
                {devotionalParts.introducaoParagraphs.length > 0 && (
                  <>
                    <ThemedText style={styles.sectionTitle}>Introdução</ThemedText>
                    {devotionalParts.introducaoParagraphs.map((paragraph: string, index: number) => (
                      <ThemedText key={`intro-${index}`} style={styles.paragraph}>
                        {paragraph.trim()}
                      </ThemedText>
                    ))}
                  </>
                )}

                {/* Tópicos */}
                {devotionalParts.topicos.length > 0 &&
                  devotionalParts.topicos.map((topico, topicoIndex) => (
                    <View key={`topico-${topicoIndex}`}>
                      <ThemedText style={styles.topicoTitle}>
                        {topico.titulo}
                      </ThemedText>
                      {topico.paragraphs.map((paragraph: string, paragraphIndex: number) => (
                        <ThemedText key={`topico-${topicoIndex}-p-${paragraphIndex}`} style={styles.paragraph}>
                          {paragraph.trim()}
                        </ThemedText>
                      ))}
                    </View>
                  ))
                }

                {/* Conclusão */}
                {devotionalParts.conclusaoParagraphs.length > 0 && (
                  <>
                    <ThemedText style={styles.sectionTitle}>Conclusão</ThemedText>
                    {devotionalParts.conclusaoParagraphs.map((paragraph: string, index: number) => (
                      <ThemedText key={`conclusao-${index}`} style={styles.paragraph}>
                        {paragraph.trim()}
                      </ThemedText>
                    ))}
                  </>
                )}

                {/* Oração */}
                {devotionalParts.oracaoParagraphs.length > 0 && (
                  <>
                    <ThemedText style={styles.sectionTitle}>Oração</ThemedText>
                    {devotionalParts.oracaoParagraphs.map((paragraph: string, index: number) => (
                      <ThemedText key={`oracao-${index}`} style={[styles.paragraph, styles.prayerText]}>
                        {paragraph.trim()}
                      </ThemedText>
                    ))}
                  </>
                )}
              </>
            )}
          </ThemedView>

          {/* Disclaimer */}
          <View style={styles.disclaimerContainer}>
            <IconSymbol
              size={18}
              name="info.circle.fill"
              color="#757575"
              style={styles.disclaimerIcon}
            />
            <ThemedText style={styles.disclaimerText}>
              Este conteúdo é gerado por IA e não substitui a leitura direta da Bíblia, a orientação pastoral ou a inspiração do Espírito Santo. Busque sempre a Palavra de Deus como fonte primária de verdade e sabedoria.
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
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      android: {
        paddingTop: 8,
        paddingBottom: 8
      }
    })
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
    padding: 16,
    paddingBottom: 32,
  },
  devotionalContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  devotionalTitleContainer: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  devotionalTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#333333',
    textAlign: 'center',
  },
  verseContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
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
    color: '#555555',
    marginBottom: 8,
    textAlign: 'center',
  },
  verseReference: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    textAlign: 'right',
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    alignSelf: 'flex-end',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'justify',
    fontFamily: Fonts.regular,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Fonts.semiBold,
    color: '#2E7D32',
    marginTop: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
    paddingLeft: 10,
  },
  topicoTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: Fonts.semiBold,
    color: '#33691E',
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(76, 175, 80, 0.2)',
  },
  prayerText: {
    fontStyle: 'italic',
    color: '#546E7A',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    alignItems: 'flex-start',
  },
  disclaimerIcon: {
    marginRight: 8,
    marginTop: 3,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#757575',
    lineHeight: 16,
  },
}); 
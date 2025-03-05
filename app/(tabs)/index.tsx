import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTranslatedVerseOfTheDay } from '@/hooks/queries/useVerseOfTheDay';
import { DevotionalHistory, loadRecentDevotionals } from '@/services/devotionalService';
import { shareVerse } from '@/services/shareService';

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [devotionalHistory, setDevotionalHistory] = useState<DevotionalHistory[]>([]);

  // Utilize o hook personalizado para buscar o versículo do dia traduzido
  const { data: translatedVerse, isLoading: verseLoading } = useTranslatedVerseOfTheDay();

  // Carregar histórico de devocionais
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

  // Recarregar dados cada vez que a tela receber foco
  useFocusEffect(
    useCallback(() => {
      loadDevotionalHistory();
    }, [])
  );

  const navigateToDevotional = () => {
    router.push('/devotional');
  };

  const navigateToHistory = () => {
    router.push('/history');
  };

  const openDevotionalResult = (item: DevotionalHistory) => {
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

  // Função para renderizar o versículo do dia
  const renderVerse = () => {
    if (verseLoading || !translatedVerse) {
      return (
        <ThemedView style={styles.verseCard}>
          <View style={styles.verseHeader}>
            <ThemedText style={styles.verseTitle}>Versículo do Dia</ThemedText>
          </View>
          <ActivityIndicator size="small" color="#4CAF50" style={{ marginVertical: 15 }} />
        </ThemedView>
      );
    }

    return (
      <ThemedView style={styles.verseCard}>
        <View style={styles.verseHeader}>
          <ThemedText style={styles.verseTitle}>Versículo do Dia</ThemedText>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => {
              if (translatedVerse) {
                shareVerse(translatedVerse.text, translatedVerse.reference);
              }
            }}
          >
            <IconSymbol name="square.and.arrow.up" size={18} color="#4CAF50" />
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.verseText}>
          {translatedVerse.text}
        </ThemedText>
        <ThemedText style={styles.verseReference}>
          {translatedVerse.reference}
        </ThemedText>
      </ThemedView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <IconSymbol
            size={28}
            name="book.fill"
            color="#4CAF50"
            style={styles.headerIcon}
          />
          <ThemedText style={styles.headerTitle}>Devocional Diário</ThemedText>
        </View>

        {/* Versículo em Destaque */}
        {renderVerse()}

        {/* Botão Novo Devocional */}
        <Pressable
          style={({ pressed }) => [
            styles.devotionalButton,
            { opacity: pressed ? 0.9 : 1 }
          ]}
          onPress={navigateToDevotional}
        >
          <IconSymbol
            size={24}
            name="plus.circle.fill"
            color="#FFFFFF"
            style={styles.buttonIcon}
          />
          <ThemedText style={styles.buttonText}>
            Criar Novo Devocional
          </ThemedText>
        </Pressable>

        {/* Devocionais Recentes */}
        <View style={styles.recentSection}>
          <ThemedText style={styles.sectionTitle}>
            Devocionais Recentes
          </ThemedText>

          {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
          ) : devotionalHistory.length > 0 ? (
            <>
              <View style={styles.historyList}>
                {devotionalHistory.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.historyItem}
                    onPress={() => openDevotionalResult(item)}
                  >
                    <View style={styles.historyItemContent}>
                      <ThemedText style={styles.historyItemTitle} numberOfLines={1}>
                        {item.title}
                      </ThemedText>
                      <ThemedText style={styles.historyItemTheme} numberOfLines={1}>
                        Tema: {item.theme}
                      </ThemedText>
                      <ThemedText style={styles.historyItemDate}>
                        {item.date}
                      </ThemedText>
                    </View>
                    <IconSymbol
                      name="chevron.right"
                      size={18}
                      color="#757575"
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={navigateToHistory}
              >
                <ThemedText style={styles.viewAllText}>
                  Ver Todos
                </ThemedText>
                <IconSymbol
                  name="arrow.right"
                  size={16}
                  color="#4CAF50"
                />
              </TouchableOpacity>
            </>
          ) : (
            <ThemedView style={styles.emptyState}>
              <IconSymbol
                size={40}
                name="book.closed.fill"
                color="#BDBDBD"
                style={styles.emptyIcon}
              />
              <ThemedText style={styles.emptyText}>
                Nenhum devocional recente
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Seus devocionais aparecerão aqui
              </ThemedText>
            </ThemedView>
          )}
        </View>

        {/* Seção informativa */}
        <ThemedView style={styles.infoCard}>
          <IconSymbol
            size={24}
            name="lightbulb.fill"
            color="#FFB74D"
            style={styles.infoIcon}
          />
          <View style={styles.infoContent}>
            <ThemedText style={styles.infoTitle}>
              Como utilizar o aplicativo
            </ThemedText>
            <ThemedText style={styles.infoText}>
              Acesse a aba Devocional, digite um tema de seu interesse e receba um devocional personalizado baseado em passagens bíblicas.
            </ThemedText>
          </View>
        </ThemedView>

        {/* Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <IconSymbol
            size={20}
            name="info.circle.fill"
            color="#2196F3"
            style={styles.disclaimerIcon}
          />
          <ThemedText style={styles.disclaimerText}>
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
    backgroundColor: '#F9F9F9',
    ...Platform.select({
      android: {
        paddingTop: 16,
        paddingBottom: 8
      }
    })
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Inter-SemiBold',
  },
  verseCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verseTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  shareButton: {
    padding: 4,
  },
  verseText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
  },
  verseReference: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'right',
  },
  devotionalButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  loader: {
    marginVertical: 20,
  },
  historyList: {
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  historyItemContent: {
    flex: 1,
    marginRight: 8,
  },
  historyItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  historyItemTheme: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  historyItemDate: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  viewAllText: {
    color: '#4CAF50',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  infoIcon: {
    marginRight: 12,
    alignSelf: 'flex-start',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#616161',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: 12,
  },
  disclaimerIcon: {
    marginRight: 12,
    alignSelf: 'flex-start',
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#424242',
  },
});
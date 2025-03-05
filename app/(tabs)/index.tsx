import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
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
import { DevotionalHistory, loadRecentDevotionals } from '@/services/devotionalService';
import { shareVerse } from '@/services/shareService';
import { getRandomVerse } from '@/utils/verseUtils';

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [devotionalHistory, setDevotionalHistory] = useState<DevotionalHistory[]>([]);
  const [featuredVerse, setFeaturedVerse] = useState(getRandomVerse());

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

  useEffect(() => {
    // Selecionar um versículo aleatório
    setFeaturedVerse(getRandomVerse());

    // Carregamento inicial dos devocionais
    loadDevotionalHistory();
  }, []);

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
        <ThemedView style={styles.verseCard}>
          <View style={styles.verseHeader}>
            <ThemedText style={styles.verseTitle}>Versículo do Dia</ThemedText>
            <TouchableOpacity style={styles.shareButton} onPress={() => shareVerse(featuredVerse.text, featuredVerse.reference)}>
              <IconSymbol name="square.and.arrow.up" size={18} color="#4CAF50" />
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.verseText}>
            "{featuredVerse.text}"
          </ThemedText>
          <ThemedText style={styles.verseReference}>
            {featuredVerse.reference}
          </ThemedText>
        </ThemedView>

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
    marginBottom: 20,
    paddingVertical: 12,
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  verseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
  },
  shareButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  verseText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  verseReference: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'right',
    fontWeight: '500',
  },
  devotionalButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 24,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
  },
  loader: {
    marginVertical: 20,
  },
  historyList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  historyItemContent: {
    flex: 1,
    marginRight: 8,
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 4,
  },
  historyItemTheme: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 4,
  },
  historyItemDate: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#616161',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#795548',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#795548',
    lineHeight: 20,
  },
  disclaimerContainer: {
    marginTop: 8,
    marginBottom: 20,
    padding: 12,
    backgroundColor: 'rgba(33, 150, 243, 0.08)',
    borderRadius: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  disclaimerIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    color: '#424242',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  footerIcon: {
    marginRight: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#757575',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginRight: 4,
  },
});
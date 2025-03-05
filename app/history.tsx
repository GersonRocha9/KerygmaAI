import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { clearDevotionalHistory, DevotionalHistory, loadDevotionalHistory } from '@/services/devotionalService';

export default function HistoryScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [devotionalHistory, setDevotionalHistory] = useState<DevotionalHistory[]>([]);

  useEffect(() => {
    // Carregar o histórico completo de devocionais
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const history = await loadDevotionalHistory();
      setDevotionalHistory(history);
    } catch (error) {
      console.error("Erro ao carregar histórico de devocionais:", error);
    } finally {
      setLoading(false);
    }
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

  const handleClearHistory = () => {
    Alert.alert(
      "Limpar Histórico",
      "Tem certeza que deseja limpar todo o histórico de devocionais?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const success = await clearDevotionalHistory();
              if (success) {
                setDevotionalHistory([]);
              } else {
                Alert.alert("Erro", "Não foi possível limpar o histórico");
              }
            } catch (error) {
              console.error("Erro ao limpar histórico:", error);
              Alert.alert("Erro", "Ocorreu um erro ao limpar o histórico");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Histórico de Devocionais',
          headerTintColor: '#4CAF50',
          headerTitleStyle: {
            color: '#4CAF50',
            fontWeight: 'bold',
          },
          headerBackTitle: 'Voltar',
        }}
      />

      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
              <IconSymbol
                size={24}
                name="clock.fill"
                color="#4CAF50"
                style={styles.headerIcon}
              />
              <ThemedText style={styles.headerTitle}>
                Seus Devocionais
              </ThemedText>
            </View>
            {devotionalHistory.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearHistory}
              >
                <IconSymbol
                  size={22}
                  name="trash.fill"
                  color="#D32F2F"
                />
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
          ) : devotionalHistory.length > 0 ? (
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
          ) : (
            <ThemedView style={styles.emptyState}>
              <IconSymbol
                size={40}
                name="book.closed.fill"
                color="#BDBDBD"
                style={styles.emptyIcon}
              />
              <ThemedText style={styles.emptyText}>
                Nenhum devocional encontrado
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Crie seu primeiro devocional na tela inicial
              </ThemedText>
            </ThemedView>
          )}
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  clearButton: {
    padding: 8,
  },
  loader: {
    marginTop: 32,
  },
  historyList: {
    marginTop: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  historyItemContent: {
    flex: 1,
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 32,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#616161',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
  },
}); 
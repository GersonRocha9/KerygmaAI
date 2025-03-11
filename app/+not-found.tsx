import { Stack, useRouter } from 'expo-router'
import { Platform, Pressable, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { IconSymbol } from '@/components/ui/IconSymbol'
import React from 'react'

export default function NotFoundScreen() {
  const router = useRouter()

  const goToHome = () => {
    router.replace('/')
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Página não encontrada',
          headerTintColor: '#4CAF50',
          headerTitleStyle: {
            color: '#4CAF50',
            fontWeight: 'bold',
          },
          headerBackTitle: 'Voltar',
        }}
      />
      <ThemedView style={styles.container}>
        <View style={styles.iconContainer}>
          <IconSymbol name="book.closed.fill" size={80} color="#BDBDBD" />
        </View>

        <ThemedText style={styles.title}>
          Oops! Página não encontrada
        </ThemedText>
        <ThemedText style={styles.message}>
          A página que você está procurando não existe ou foi movida.
        </ThemedText>

        <Pressable onPress={goToHome}>
          <ThemedView style={styles.button}>
            <IconSymbol
              name="arrow.left"
              size={20}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
            <ThemedText style={styles.buttonText}>
              Voltar para a tela inicial
            </ThemedText>
          </ThemedView>
        </Pressable>

        <ThemedText style={styles.disclaimer}>
          Se você acredita que isso é um erro, por favor reinicie o aplicativo.
        </ThemedText>
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F9F9F9',
    ...Platform.select({
      android: {
        paddingTop: 8,
        paddingBottom: 8,
      },
    }),
  },
  iconContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#616161',
    marginBottom: 32,
    textAlign: 'center',
    maxWidth: '80%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 48,
    textAlign: 'center',
    maxWidth: '80%',
  },
})

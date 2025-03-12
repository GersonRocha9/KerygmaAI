import { ThemedText } from '@/components/ThemedText'
import React from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'
import { useCheckUpdate } from '../hooks/useCheckUpdate'

export function UpdateAlert() {
  const { isUpdateAvailable, openStore } = useCheckUpdate()

  if (!isUpdateAvailable) {
    return null
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>Nova versão disponível!</ThemedText>
        <ThemedText style={styles.message}>
          Uma nova versão do app está disponível na{' '}
          {Platform.OS === 'ios' ? 'App Store' : 'Play Store'}. Atualize agora
          para ter acesso às últimas novidades!
        </ThemedText>
        <Pressable onPress={openStore} style={styles.button}>
          <ThemedText style={styles.buttonText}>Atualizar agora</ThemedText>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 16,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

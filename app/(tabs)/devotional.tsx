import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { generateDevotional } from '@/services/aiService';
import { saveDevotionalToHistory } from '@/services/devotionalService';

// Definindo o schema de validação com zod
const formSchema = z.object({
  theme: z.string().min(1, 'Por favor, digite um tema para o devocional')
});

// Tipo derivado do schema para TypeScript
type FormData = z.infer<typeof formSchema>;

export default function DevotionalScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Configuração do react-hook-form com validação zod
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError('');

      // Usar o serviço de geração de devocional
      const result = await generateDevotional(data.theme.trim());

      if (result && result.title && result.content) {
        // Salvar o devocional no histórico antes de navegar
        await saveDevotionalToHistory(result.title, result.content, data.theme);

        // Navegar para a tela de resultado com o conteúdo do devocional e o título
        router.push({
          pathname: '/devotional-result',
          params: {
            content: result.content,
            title: result.title,
            theme: data.theme,
            fromHistory: 'true' // Indicar que já foi salvo no histórico
          }
        });

        // Limpar o formulário
        reset();
      } else {
        throw new Error('Nenhum conteúdo retornado pela API');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao gerar o devocional');
      console.error('Erro ao gerar devocional:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.header}>
            <IconSymbol
              size={26}
              name="book.fill"
              color="#4CAF50"
              style={styles.icon}
            />
            <ThemedText style={styles.title}>Devocional Diário</ThemedText>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Qual tema você gostaria de refletir hoje?</ThemedText>

              <Controller
                control={control}
                name="theme"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.theme && styles.inputError]}
                    placeholder="ex: paciência, perdão, confiança, esperança..."
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    numberOfLines={3}
                    maxLength={100}
                  />
                )}
              />

              {errors.theme && (
                <ThemedText style={styles.errorMessage}>
                  {errors.theme.message}
                </ThemedText>
              )}

              <View style={styles.buttonContainer}>
                <TouchableWithoutFeedback onPress={handleSubmit(onSubmit)} disabled={loading}>
                  <ThemedView style={[styles.button, loading && styles.buttonDisabled]}>
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <ThemedText style={styles.buttonText}>Gerar Devocional</ThemedText>
                    )}
                  </ThemedView>
                </TouchableWithoutFeedback>
              </View>

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

              {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
            </ThemedView>

            <ThemedView style={styles.infoContainer}>
              <IconSymbol
                size={20}
                name="lightbulb.fill"
                color="#FFB74D"
                style={styles.infoIcon}
              />
              <ThemedText style={styles.infoText}>
                Digite um tema ou assunto para receber um devocional personalizado sobre ele.
                Exemplos: "esperança em tempos difíceis", "amor ao próximo", "confiar em Deus", etc.
              </ThemedText>
            </ThemedView>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  inputContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#D32F2F',
    borderWidth: 1,
  },
  errorMessage: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#D32F2F',
    marginTop: 12,
    textAlign: 'center',
  },
  devotionalContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  devotionalText: {
    fontSize: 16,
    lineHeight: 24,
  },
  disclaimerContainer: {
    marginTop: 16,
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
  infoContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#795548',
    lineHeight: 20,
  },
});

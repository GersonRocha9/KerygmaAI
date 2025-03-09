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
import { useLanguage } from '@/hooks/useLanguage';
import { useThemeBorderRadius, useThemeColors, useThemeSpacing } from '@/hooks/useTheme';
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
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const borderRadius = useThemeBorderRadius();
  const { t } = useLanguage();

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

      const result = await generateDevotional(data.theme.trim());

      if (result && result.title && result.content) {
        await saveDevotionalToHistory(result.title, result.content, data.theme);

        router.push({
          pathname: '/devotional-result',
          params: {
            content: result.content,
            title: result.title,
            theme: data.theme,
            fromHistory: 'true'
          }
        });

        reset();
      } else {
        throw new Error(t('devotional.noContentError'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('devotional.apiError'));
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
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <IconSymbol
              size={26}
              name="book.fill"
              color={colors.primary}
              style={{ marginRight: spacing.sm }}
            />
            <ThemedText variant="primary" type="subtitle">
              {t('common.appName')}
            </ThemedText>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={[styles.scrollContent, { padding: spacing.md }]}>
            <ThemedView
              variant="cardVariant"
              style={[
                styles.inputContainer,
                {
                  borderRadius: borderRadius.lg,
                  padding: spacing.md,
                }
              ]}
            >
              <ThemedText variant="primary" style={styles.label}>
                {t('devotional.questionPrompt')}
              </ThemedText>

              <Controller
                control={control}
                name="theme"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.surface,
                        borderColor: errors.theme ? colors.error : colors.border,
                        borderRadius: borderRadius.md,
                        color: colors.textPrimary,
                      }
                    ]}
                    placeholder={t('devotional.themePlaceholder')}
                    placeholderTextColor={colors.textTertiary}
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
                <ThemedText style={[styles.errorMessage, { color: colors.error }]}>
                  {t('devotional.themeError')}
                </ThemedText>
              )}

              <View style={[styles.buttonContainer, { marginTop: spacing.md }]}>
                <TouchableWithoutFeedback onPress={handleSubmit(onSubmit)} disabled={loading}>
                  <ThemedView
                    style={[
                      styles.button,
                      {
                        backgroundColor: loading ? colors.surfaceVariant : colors.primary,
                        borderRadius: borderRadius.md,
                        padding: spacing.md,
                      }
                    ]}
                  >
                    {loading ? (
                      <ActivityIndicator color={colors.primary} size="small" />
                    ) : (
                      <ThemedText style={[styles.buttonText, { color: colors.surface }]}>
                        {t('devotional.generateButton')}
                      </ThemedText>
                    )}
                  </ThemedView>
                </TouchableWithoutFeedback>
              </View>

              {/* Disclaimer */}
              <View
                style={[
                  styles.disclaimerContainer,
                  {
                    marginTop: spacing.md,
                    padding: spacing.sm,
                    borderRadius: borderRadius.md,
                    backgroundColor: colors.info + '10',
                    borderLeftColor: colors.info,
                  }
                ]}
              >
                <IconSymbol
                  size={20}
                  name="info.circle.fill"
                  color={colors.info}
                  style={{ marginRight: spacing.sm }}
                />
                <ThemedText variant="secondary" style={styles.disclaimerText}>
                  {t('devotional.disclaimer')}
                </ThemedText>
              </View>

              {error ? (
                <ThemedText style={[styles.errorText, { color: colors.error, marginTop: spacing.sm }]}>
                  {error}
                </ThemedText>
              ) : null}
            </ThemedView>

            <ThemedView
              variant="cardVariant"
              style={[
                styles.infoContainer,
                {
                  borderRadius: borderRadius.lg,
                  padding: spacing.md,
                  marginTop: spacing.md,
                }
              ]}
            >
              <IconSymbol
                size={20}
                name="lightbulb.fill"
                color={colors.warning}
                style={{ marginRight: spacing.sm }}
              />
              <ThemedText variant="secondary" style={styles.infoText}>
                {t('devotional.howToUseDescription')}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  inputContainer: {
    // flex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    fontFamily: 'Inter-Regular',
  },
  errorMessage: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 2,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
});

import { TranslatedVerse, translateVerseToNAA } from '@/services/aiService';
import { VerseOfTheDay, fetchVerseOfTheDay } from '@/services/verseService';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook para obter a data atual no formato YYYY-MM-DD
 * @returns string da data atual em formato YYYY-MM-DD
 */
export const useCurrentDate = (): string => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

/**
 * Hook personalizado para buscar e retornar o versículo do dia usando React Query
 * Inclui a data atual como parte da query key para garantir que o versículo
 * seja atualizado apenas uma vez por dia
 * 
 * @returns O resultado da query com o versículo do dia em inglês
 */
export const useVerseOfTheDay = () => {
  const currentDate = useCurrentDate();

  return useQuery<VerseOfTheDay>({
    queryKey: ['verseOfTheDay', currentDate],
    queryFn: fetchVerseOfTheDay,
    staleTime: 24 * 60 * 60 * 1000, // 24 horas
    gcTime: 24 * 60 * 60 * 1000, // 24 horas
    retry: 1
  });
};

/**
 * Hook personalizado que retorna o versículo do dia traduzido para português no formato da Bíblia NAA
 * Primeiro busca o versículo original em inglês e depois o traduz
 * 
 * @returns O resultado da query com o versículo traduzido para português
 */
export const useTranslatedVerseOfTheDay = () => {
  const currentDate = useCurrentDate();
  const verseQuery = useVerseOfTheDay();

  return useQuery<TranslatedVerse>({
    queryKey: ['translatedVerseOfTheDay', currentDate],
    queryFn: async () => {
      // Espera pelo resultado do versículo em inglês
      if (!verseQuery.data) {
        throw new Error('Versículo em inglês não disponível');
      }

      // Traduz o versículo para português
      return await translateVerseToNAA(verseQuery.data);
    },
    enabled: !!verseQuery.data, // Só executa quando o versículo em inglês estiver disponível
    staleTime: 24 * 60 * 60 * 1000, // 24 horas
    gcTime: 24 * 60 * 60 * 1000, // 24 horas
    retry: 1
  });
}; 
import { useTranslatedVerseOfTheDay, useVerseOfTheDay } from '@/hooks/queries/useVerseOfTheDay';
import * as Language from '@/hooks/useLanguage';
import versiculosPT from '@/i18n/versiculos-pt.json';
import versiculosEN from '@/i18n/versiculos.json';
import { renderHook } from '@testing-library/react-native';

// Mock do módulo de linguagem
jest.mock('@/hooks/useLanguage', () => ({
  useLanguage: jest.fn(),
}));

// Mock do React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn().mockImplementation(({ queryFn }) => {
    return {
      data: queryFn(),
      isLoading: false,
      isError: false,
      error: null,
    };
  }),
}));

describe('useVerseOfTheDay', () => {
  beforeEach(() => {
    // Limpar os mocks
    jest.clearAllMocks();
  });

  it('deve retornar um versículo em inglês quando o idioma atual é inglês', () => {
    // Configurar o mock para retornar inglês como idioma atual
    (Language.useLanguage as jest.Mock).mockReturnValue({
      isEnglish: true,
      currentLanguage: 'en',
    });

    // Renderizar o hook
    const { result } = renderHook(() => useVerseOfTheDay());

    // Verificar se o resultado corresponde a um versículo em inglês
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.length).toBe(3); // [verse, reference, id]

    // Verificar se o versículo está na lista de versículos em inglês
    const verseText = result.current.data?.[0];
    const verseIndex = versiculosEN.findIndex(v => v.verse === verseText);
    expect(verseIndex).not.toBe(-1);
  });

  it('deve retornar um versículo em português quando o idioma atual é português', () => {
    // Configurar o mock para retornar português como idioma atual
    (Language.useLanguage as jest.Mock).mockReturnValue({
      isEnglish: false,
      currentLanguage: 'pt',
    });

    // Renderizar o hook
    const { result } = renderHook(() => useVerseOfTheDay());

    // Verificar se o resultado corresponde a um versículo em português
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.length).toBe(3); // [verse, reference, id]

    // Verificar se o versículo está na lista de versículos em português
    const verseText = result.current.data?.[0];
    const verseIndex = versiculosPT.findIndex(v => v.verse === verseText);
    expect(verseIndex).not.toBe(-1);
  });

  it('useTranslatedVerseOfTheDay deve retornar um versículo no idioma atual', () => {
    // Configurar o mock para retornar inglês como idioma atual
    (Language.useLanguage as jest.Mock).mockReturnValue({
      isEnglish: true,
      currentLanguage: 'en',
    });

    // Renderizar o hook
    const { result } = renderHook(() => useTranslatedVerseOfTheDay());

    // Verificar se o resultado corresponde a um versículo no formato esperado
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.text).toBeDefined();
    expect(result.current.data?.reference).toBeDefined();
    expect(result.current.data?.translation).toBe('NIV'); // Deve ser NIV para inglês
  });
}); 
import {
  clearDevotionalHistory,
  DevotionalHistory,
  loadDevotionalHistory,
  saveDevotionalToHistory
} from '@/services/devotionalService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('devotionalService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockDevotional: DevotionalHistory = {
    id: '1684108800000',
    date: '15/05/2023',
    title: 'Devocional Teste',
    theme: 'Paz',
    content: 'Conteúdo do devocional sobre paz.'
  };

  describe('saveDevotionalToHistory', () => {
    it('deve salvar um devocional no histórico', async () => {
      // Mock AsyncStorage.getItem para simular não ter histórico ainda
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      await saveDevotionalToHistory(
        mockDevotional.title,
        mockDevotional.content,
        mockDevotional.theme
      );

      // Verifica se getItem foi chamado com a chave correta
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('devotionalHistory');

      // Verifica se setItem foi chamado com uma string JSON
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'devotionalHistory',
        expect.any(String)
      );

      // Verifica se o objeto passado para setItem contém um array com um devocional
      const setItemCall = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const savedData = JSON.parse(setItemCall);
      expect(Array.isArray(savedData)).toBe(true);
      expect(savedData.length).toBe(1);
      expect(savedData[0].title).toBe(mockDevotional.title);
      expect(savedData[0].theme).toBe(mockDevotional.theme);
      expect(savedData[0].content).toBe(mockDevotional.content);
    });

    it('deve adicionar o devocional ao histórico existente', async () => {
      // Mock do histórico existente
      const existingHistory = [
        {
          id: '1684022400000',
          date: '14/05/2023',
          title: 'Devocional Anterior',
          theme: 'Amor',
          content: 'Conteúdo do devocional sobre amor.'
        },
      ];

      // Mock AsyncStorage.getItem para retornar o histórico existente
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(existingHistory));

      await saveDevotionalToHistory(
        mockDevotional.title,
        mockDevotional.content,
        mockDevotional.theme
      );

      // Verifica se setItem foi chamado
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'devotionalHistory',
        expect.any(String)
      );

      // Verifica se o novo devocional foi adicionado ao início do array
      const setItemCall = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const savedData = JSON.parse(setItemCall);
      expect(savedData.length).toBe(2);
      expect(savedData[0].title).toBe(mockDevotional.title);
      expect(savedData[1].title).toBe(existingHistory[0].title);
    });
  });

  describe('loadDevotionalHistory', () => {
    it('deve carregar o histórico de devocionais', async () => {
      const mockHistory = [mockDevotional];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockHistory));

      const result = await loadDevotionalHistory();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('devotionalHistory');
      expect(result).toEqual(mockHistory);
    });

    it('deve retornar um array vazio se não houver histórico', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await loadDevotionalHistory();

      expect(result).toEqual([]);
    });
  });

  describe('clearDevotionalHistory', () => {
    it('deve limpar o histórico de devocionais', async () => {
      // Mock para simular sucesso
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await clearDevotionalHistory();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('devotionalHistory', '[]');
      expect(result).toBe(true);
    });
  });
}); 
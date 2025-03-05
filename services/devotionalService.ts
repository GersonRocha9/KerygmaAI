import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipo para os devocionais salvos
export interface DevotionalHistory {
  id: string;
  date: string;
  title: string;
  theme: string;
  content: string;
}

/**
 * Carrega o histórico completo de devocionais
 * @returns Lista de devocionais ordenada do mais recente para o mais antigo
 */
export const loadDevotionalHistory = async (): Promise<DevotionalHistory[]> => {
  try {
    const savedDevotionals = await AsyncStorage.getItem('devotionalHistory');
    if (savedDevotionals) {
      return JSON.parse(savedDevotionals) as DevotionalHistory[];
    }
    return [];
  } catch (error) {
    console.error("Erro ao carregar histórico de devocionais:", error);
    return [];
  }
};

/**
 * Carrega um número limitado de devocionais recentes
 * @param limit Número máximo de devocionais a serem carregados
 * @returns Lista limitada de devocionais ordenada do mais recente para o mais antigo
 */
export const loadRecentDevotionals = async (limit: number = 3): Promise<DevotionalHistory[]> => {
  try {
    const devotionals = await loadDevotionalHistory();
    return devotionals.slice(0, limit);
  } catch (error) {
    console.error("Erro ao carregar devocionais recentes:", error);
    return [];
  }
};

/**
 * Salva um novo devocional no histórico
 * @param title O título do devocional
 * @param content O conteúdo do devocional
 * @param theme O tema utilizado para gerar o devocional
 * @returns Verdadeiro se o devocional foi salvo com sucesso
 */
export const saveDevotionalToHistory = async (
  title: string,
  content: string,
  theme: string
): Promise<boolean> => {
  try {
    // Obter histórico existente
    const devotionalHistory = await loadDevotionalHistory();

    // Criar novo item de histórico
    const newDevotional: DevotionalHistory = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      title,
      theme,
      content
    };

    // Adicionar ao início da lista (mais recente primeiro)
    const updatedHistory = [newDevotional, ...devotionalHistory];

    // Limitar a lista para os 20 mais recentes
    const trimmedHistory = updatedHistory.length > 20
      ? updatedHistory.slice(0, 20)
      : updatedHistory;

    // Salvar de volta no AsyncStorage
    await AsyncStorage.setItem('devotionalHistory', JSON.stringify(trimmedHistory));
    return true;
  } catch (error) {
    console.error('Erro ao salvar histórico de devocionais:', error);
    return false;
  }
};

/**
 * Limpa todo o histórico de devocionais
 * @returns Verdadeiro se o histórico foi limpo com sucesso
 */
export const clearDevotionalHistory = async (): Promise<boolean> => {
  try {
    await AsyncStorage.setItem('devotionalHistory', JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Erro ao limpar histórico de devocionais:', error);
    return false;
  }
};

/**
 * Remove um devocional específico do histórico pelo ID
 * @param id O ID do devocional a ser removido
 * @returns Verdadeiro se o devocional foi removido com sucesso
 */
export const deleteDevotional = async (id: string): Promise<boolean> => {
  try {
    // Obter histórico existente
    const devotionalHistory = await loadDevotionalHistory();

    // Filtrar o histórico removendo o item com o ID correspondente
    const updatedHistory = devotionalHistory.filter(item => item.id !== id);

    // Verificar se algum item foi removido
    if (updatedHistory.length === devotionalHistory.length) {
      return false; // Nenhum item foi removido
    }

    // Salvar de volta no AsyncStorage
    await AsyncStorage.setItem('devotionalHistory', JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Erro ao excluir devocional:', error);
    return false;
  }
}; 
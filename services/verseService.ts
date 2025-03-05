export type VerseOfTheDay = string[];

/**
 * Busca o versículo do dia da API
 * @returns Uma Promise com os dados do versículo do dia
 */
export const fetchVerseOfTheDay = async (): Promise<VerseOfTheDay> => {
  const url = 'https://bible-verse-of-the-day.p.rapidapi.com/verse';
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '1ffe295876msh25eb305e6c62da5p1af18cjsn99a9f0ae72ac',
      'x-rapidapi-host': 'bible-verse-of-the-day.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error('Falha ao buscar o versículo do dia');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao buscar versículo do dia:', error);
    throw error;
  }
};

/**
 * Função alternativa que retorna null em caso de erro,
 * para compatibilidade com códigos existentes
 */
export const getVerseOfTheDay = async (): Promise<VerseOfTheDay | null> => {
  try {
    return await fetchVerseOfTheDay();
  } catch (error) {
    console.error(error);
    return null;
  }
}; 
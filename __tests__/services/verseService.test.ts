import {
  type VerseOfTheDay,
  fetchVerseOfTheDay,
  getVerseOfTheDay,
} from '@/services/verseService'

// Mock do fetch global
global.fetch = jest.fn() as jest.Mock

describe('verseService', () => {
  const mockVerse: VerseOfTheDay = [
    'John',
    ' ',
    '3',
    ':',
    '16',
    'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchVerseOfTheDay', () => {
    it('deve buscar o versículo do dia com sucesso', async () => {
      // Mock do fetch retornando um versículo
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockVerse),
      })

      const result = await fetchVerseOfTheDay()

      expect(result).toEqual(mockVerse)
      expect(global.fetch).toHaveBeenCalledWith(
        'https://bible-verse-of-the-day.p.rapidapi.com/verse',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'x-rapidapi-host': 'bible-verse-of-the-day.p.rapidapi.com',
          }),
        })
      )
    })

    it('deve lançar um erro quando a resposta não for ok', async () => {
      // Mock do fetch retornando erro
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(fetchVerseOfTheDay()).rejects.toThrow(
        'Falha ao buscar o versículo do dia'
      )
    })

    it('deve lançar o erro quando a rede falhar', async () => {
      const networkError = new Error('Network error')
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(networkError)

      await expect(fetchVerseOfTheDay()).rejects.toThrow(networkError)
    })
  })

  describe('getVerseOfTheDay', () => {
    it('deve retornar o versículo do dia com sucesso', async () => {
      // Mock do fetchVerseOfTheDay com sucesso
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockVerse),
      })

      const result = await getVerseOfTheDay()

      expect(result).toEqual(mockVerse)
    })

    it('deve retornar null quando ocorrer um erro', async () => {
      // Mock para silenciar console.error nos testes
      const originalConsoleError = console.error
      console.error = jest.fn()

      // Mock do fetch para lançar um erro
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

      const result = await getVerseOfTheDay()

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalled()

      // Restaurar console.error
      console.error = originalConsoleError
    })
  })
})

import { generateDevotional, translateVerseToNAA } from '@/services/aiService';

// Mock do fetch global
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      choices: [
        {
          message: {
            content: 'TÍTULO: Devocional sobre Esperança\nConteúdo do devocional sobre esperança.',
          },
        },
      ],
    }),
  })
) as jest.Mock;

describe('aiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateDevotional', () => {
    it('deve gerar um devocional baseado em um tema', async () => {
      const theme = 'esperança';
      const result = await generateDevotional(theme);

      expect(result).toEqual({
        title: 'Devocional sobre Esperança',
        content: 'Conteúdo do devocional sobre esperança.',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining(theme),
        })
      );
    });

    it('deve lidar com erros da API e retornar mensagem apropriada', async () => {
      // Mock uma resposta de erro
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: () => Promise.resolve({ error: { message: 'Erro ao gerar devocional: 500 Internal Server Error' } }),
        })
      );

      await expect(generateDevotional('esperança')).rejects.toThrow('Erro ao gerar devocional: 500 Internal Server Error');
    });
  });

  describe('translateVerseToNAA', () => {
    it('deve traduzir um versículo para português', async () => {
      const englishVerse = ['John', '3', '16', 'For God so loved the world', 'that he gave his one and only Son', 'that whoever believes in him shall not perish but have eternal life'];

      // Mock uma resposta diferente para a tradução
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    book: 'João',
                    chapter: 3,
                    verse: 16,
                    text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
                    reference: 'João 3:16',
                  }),
                },
              },
            ],
          }),
        })
      );

      const result = await translateVerseToNAA(englishVerse);

      expect(result).toEqual({
        book: 'João',
        chapter: 3,
        verse: 16,
        text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
        reference: 'João 3:16',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('John'),
        })
      );
    });
  });
}); 
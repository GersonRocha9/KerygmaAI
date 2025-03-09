import { generateDevotional, translateVerseToNAA } from '@/services/aiService';

describe('aiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock do fetch global
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          choices: [
            {
              message: {
                content: 'Devocional sobre Esperança\nConteúdo do devocional sobre esperança.',
              },
            },
          ],
        }),
      })
    ) as jest.Mock;
  });

  describe('generateDevotional', () => {
    it('deve gerar um devocional em português quando isEnglish é false', async () => {
      // Configurar o comportamento do fetch para este teste
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            choices: [
              {
                message: {
                  content: 'Devocional sobre Esperança\nConteúdo do devocional sobre esperança.',
                },
              },
            ],
          }),
        })
      );

      const theme = 'esperança';
      const result = await generateDevotional(theme, false);

      expect(result).toEqual({
        title: 'Devocional sobre Esperança',
        content: 'Devocional sobre Esperança\nConteúdo do devocional sobre esperança.',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('português'),
        })
      );
    });

    it('deve gerar um devocional em inglês quando isEnglish é true', async () => {
      // Mock uma resposta em inglês
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            choices: [
              {
                message: {
                  content: 'Hope: A Divine Anchor\nContent of devotional about hope.',
                },
              },
            ],
          }),
        })
      );

      const theme = 'hope';
      const result = await generateDevotional(theme, true);

      expect(result).toEqual({
        title: 'Hope: A Divine Anchor',
        content: 'Hope: A Divine Anchor\nContent of devotional about hope.',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('English'),
        })
      );
    });

    it('deve usar o valor padrão (false) para isEnglish se não for fornecido', async () => {
      const theme = 'fé';
      await generateDevotional(theme);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('português'),
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
          json: () => Promise.resolve({
            error: { message: 'Erro ao gerar devocional: 500 Internal Server Error' }
          }),
        })
      );

      try {
        await generateDevotional('esperança');
        fail('Deveria ter lançado um erro');
      } catch (error) {
        expect((error as Error).message).toContain('Erro ao processar sua solicitação');
      }
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

      // Verificar que a API foi chamada corretamente
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('John'),
        })
      );

      // Verificar apenas os campos críticos do resultado
      expect(result.book).toBe('João');
      expect(result.chapter).toBe(3);
      expect(result.verse).toBe(16);
      expect(result.text).toContain('Porque Deus amou o mundo');
      expect(result.reference).toBe('João 3:16');
    });
  });
}); 
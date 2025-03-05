/**
 * Serviço para integração com API de IA para geração de devocionais
 */

/**
 * Interface para a resposta da requisição de IA
 */
interface AIResponse {
  title: string;
  content: string;
}

/**
 * Solicita a geração de um devocional baseado em um tema
 * @param theme O tema para o devocional
 * @returns Título e conteúdo do devocional gerado
 */
export const generateDevotional = async (theme: string): Promise<AIResponse> => {
  if (!theme.trim()) {
    throw new Error('Por favor, digite um tema para o devocional');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Você é um guia espiritual atencioso que cria devocionais profundos e detalhados. 
Escreva um devocional estruturado no formato de estudo bíblico com a seguinte estrutura:

TÍTULO: [Um título atrativo e relevante para o tema]

[Um versículo bíblico central entre aspas, seguido pela referência]

INTRODUÇÃO: [Uma introdução ao tema e ao versículo, contextualizando e apresentando o que será abordado no estudo. Aproximadamente 150 palavras.]

TÓPICO I: [Subtítulo relevante]
[Desenvolvimento do primeiro ponto principal, com aplicação bíblica e prática. Aproximadamente 200 palavras.]

TÓPICO II: [Subtítulo relevante]
[Desenvolvimento do segundo ponto principal, com aplicação bíblica e prática. Aproximadamente 200 palavras.]

TÓPICO III: [Subtítulo relevante]
[Desenvolvimento do terceiro ponto principal, com aplicação bíblica e prática. Aproximadamente 200 palavras.]

[Se necessário e relevante, adicione mais tópicos seguindo o mesmo formato]

CONCLUSÃO: [Uma conclusão que amarra todos os pontos abordados e faz um chamado à aplicação prática. Aproximadamente 150 palavras.]

ORAÇÃO: [Uma oração final significativa relacionada ao tema estudado.]

Escreva em português brasileiro. Seja profundo, reflexivo e inspirador. Inclua referências bíblicas adicionais nos tópicos para enriquecer o estudo. O conteúdo deve ser teologicamente sólido e aplicável à vida diária do leitor.`
          },
          {
            role: 'user',
            content: `Crie um devocional completo sobre: ${theme}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2500
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Falha ao gerar o devocional');
    }

    if (data.choices && data.choices[0]) {
      const devotionalContent = data.choices[0].message.content;

      // Extrair o título do conteúdo gerado
      let devotionalTitle = theme; // Default para o caso de não conseguir extrair
      const titleMatch = devotionalContent.match(/TÍTULO:\s*(.+?)(?:\n|$)/i);

      if (titleMatch && titleMatch[1]) {
        devotionalTitle = titleMatch[1].trim();
        // Remove o título do conteúdo para evitar duplicação
        const cleanContent = devotionalContent.replace(/TÍTULO:\s*(.+?)(?:\n|$)/i, '');

        return {
          title: devotionalTitle,
          content: cleanContent
        };
      }

      // Se não conseguir extrair o título, usa o conteúdo completo
      return {
        title: theme,
        content: devotionalContent
      };
    }

    throw new Error('Nenhum conteúdo retornado pela API');
  } catch (error) {
    console.error('Erro ao gerar devocional:', error);
    throw error;
  }
}; 
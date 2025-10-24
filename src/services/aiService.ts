/**
 * Serviço para integração com API de IA para geração de devocionais
 */

/**
 * Interface para a resposta da requisição de IA
 */
interface AIResponse {
  title: string
  content: string
}

/**
 * Interface para o versículo traduzido
 */
export interface TranslatedVerse {
  book: string // Nome do livro em português
  chapter: number // Número do capítulo
  verse: number // Número do versículo
  text: string // Texto do versículo traduzido
  reference: string // Referência completa formatada (ex: "João 3:16")
}

/**
 * Solicita a geração de um devocional baseado em um tema
 * @param theme O tema para o devocional
 * @param isEnglish Se o devocional deve ser gerado em inglês (se false, será gerado em português)
 * @returns Título e conteúdo do devocional gerado
 */
export const generateDevotional = async (
  theme: string,
  isEnglish = false
): Promise<AIResponse> => {
  if (!theme.trim()) {
    throw new Error(
      isEnglish
        ? 'Please enter a theme for the devotional'
        : 'Por favor, digite um tema para o devocional'
    )
  }

  try {
    console.log(
      `Generating devotional for theme "${theme}" in ${isEnglish ? 'English' : 'Portuguese'}`
    )

    // Define a instrução do sistema com base no idioma
    const systemPrompt = isEnglish
      ? `You are an attentive spiritual guide who creates deep and detailed devotionals.
Write a structured devotional in the format of a Bible study with the following structure:

1. A relevant title for the theme: "${theme}"
2. An introduction that contextualizes the theme
3. One or two Bible verses that relate to the theme
4. A reflection on the verses and how they apply to the theme
5. A brief practical application for daily life
6. A short closing prayer

Important:
- Write entirely in English
- The output must be well formatted
- Ensure the verses are accurate
- Be respectful and ecumenical
- Length: approximately 500-800 words`
      : `Você é um guia espiritual atencioso que cria devocionais profundos e detalhados.
Escreva um devocional estruturado no formato de estudo bíblico com a seguinte estrutura:

1. Um título relevante para o tema: "${theme}"
2. Uma introdução que contextualiza o tema
3. Um ou dois versículos bíblicos que se relacionam com o tema
4. Uma reflexão sobre os versículos e como eles se aplicam ao tema
5. Uma breve aplicação prática para a vida diária
6. Uma curta oração final

Importante:
- Escreva inteiramente em português
- A saída deve estar bem formatada
- Certifique-se de que os versículos estejam precisos
- Seja respeitoso e ecumênico
- Tamanho: aproximadamente 500-800 palavras`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `Crie um devocional sobre o tema: ${theme}. Use o tema como ponto de partida para reflexão bíblica, mas não se limite a ele. Inclua versículos relevantes e uma aplicação prática.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      console.error(
        `Error generating devotional: ${response.status} ${response.statusText}`
      )
      throw new Error(
        isEnglish
          ? `Error processing your request: ${response.status} ${response.statusText}`
          : `Erro ao processar sua solicitação: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Extrair título e conteúdo
    const lines = content.split('\n')
    const title = lines[0]

    return {
      title,
      content,
    }
  } catch (error) {
    console.error('Error in generateDevotional:', error)
    throw error
  }
}

/**
 * Traduz um versículo bíblico em inglês para o português no estilo da Nova Almeida Atualizada (NAA)
 * @param englishVerse Array com informações do versículo em inglês [livro, capítulo, versículo, texto...]
 * @returns Versículo traduzido com informações estruturadas
 */
export const translateVerseToNAA = async (
  englishVerse: string[]
): Promise<TranslatedVerse> => {
  if (!englishVerse || englishVerse.length < 3) {
    console.error('Invalid verse format:', englishVerse)
    throw new Error('Formato de versículo inválido')
  }

  try {
    const [book, chapterStr, verseStr, ...textParts] = englishVerse
    const verseText = textParts.join(' ')

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em traduções bíblicas. Sua tarefa é traduzir versículos bíblicos do inglês para o português, no estilo da Nova Almeida Atualizada (NAA), uma tradução conhecida por sua clareza e fidelidade ao texto original.

Forneça a tradução em um formato JSON com as seguintes propriedades:
- book: nome do livro em português
- chapter: número do capítulo
- verse: número do versículo
- text: texto traduzido do versículo
- reference: referência completa formatada (ex: "João 3:16")

Seja fiel ao texto original, mas use o português contemporâneo e formal da NAA. Não adicione interpretações ou explicações.`,
          },
          {
            role: 'user',
            content: `Traduza o seguinte versículo bíblico:
Livro: ${book}
Capítulo: ${verseStr}
Versículo: ${textParts[0]}
Texto: ${textParts.slice(1).join(' ')}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error(
        `Erro ao traduzir versículo: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    const translationJson = data.choices[0].message.content

    // Parse e valide o JSON da resposta
    try {
      const translatedVerse = JSON.parse(translationJson)

      // Validar a estrutura do objeto
      if (
        !translatedVerse.book ||
        !translatedVerse.chapter ||
        !translatedVerse.verse ||
        !translatedVerse.text ||
        !translatedVerse.reference
      ) {
        throw new Error('Resposta de tradução incompleta')
      }

      return translatedVerse
    } catch (error) {
      console.error('Error parsing translation response:', error)
      throw new Error('Erro ao processar tradução do versículo')
    }
  } catch (error) {
    console.error('Error in translateVerseToNAA:', error)
    throw error
  }
}

/**
 * Funções de formatação de texto para o aplicativo Devocional Diário
 */

/**
 * Formata o título para exibição, capitalizando apenas a primeira palavra
 * @param rawTitle O título bruto a ser formatado
 * @returns O título formatado
 */
export const formatTitle = (
  rawTitle: string | string[] | null | undefined
): string | null => {
  if (!rawTitle) return null

  // Converter para string e remover aspas no início e fim
  let titleText = rawTitle.toString().trim()

  // Remover aspas (normais e curvas) no início e fim
  titleText = titleText.replace(/^["'""]|["'""]$/g, '')

  // Remover aspas duplas repetidas no início e fim (caso existam)
  titleText = titleText.replace(/^["'"'"'"]+|["'"'"'"]+$/g, '')

  // Última limpeza após remoção das aspas
  titleText = titleText.trim()

  // Dividir o título em palavras
  const words = titleText.split(' ')

  if (words.length === 0) return ''

  // Capitalizar apenas a primeira palavra
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase()

  // Manter as demais palavras em minúsculas
  for (let i = 1; i < words.length; i++) {
    words[i] = words[i].toLowerCase()
  }

  // Juntar as palavras novamente
  return words.join(' ')
}

/**
 * Interface para estruturar o conteúdo formatado do devocional
 */
interface DevotionalParts {
  verse: string | null
  reference: string | null
  introducaoParagraphs: string[]
  topicos: Array<{
    titulo: string
    paragraphs: string[]
  }>
  conclusaoParagraphs: string[]
  oracaoParagraphs: string[]
}

/**
 * Remove marcações Markdown do texto
 * @param text Texto com possíveis marcações Markdown
 * @returns Texto limpo, sem marcações
 */
const cleanMarkdown = (text: string): string => {
  return (
    text
      // Remove asteriscos duplos (marcação de negrito)
      .replace(/\*\*/g, '')
      // Remove asterisco único (marcação de itálico)
      .replace(/\*([^*]+)\*/g, '$1')
      // Remove underlines duplos (marcação de sublinhado)
      .replace(/__(.*?)__/g, '$1')
      // Remove caracteres de código (backticks)
      .replace(/`([^`]+)`/g, '$1')
      // Remove hashtags de cabeçalhos no início das linhas
      .replace(/^#+\s+/gm, '')
      // Remove marcadores de listas
      .replace(/^\s*[-*+]\s+/gm, '')
      // Remove números de listas ordenadas
      .replace(/^\s*\d+\.\s+/gm, '')
      // Limpa possíveis espaços extras
      .trim()
  )
}

/**
 * Formata o conteúdo do devocional para destacar versículos, introdução, tópicos, conclusão e orações
 * @param text O texto bruto do devocional
 * @returns Objeto estruturado com as diferentes partes do devocional
 */
export const extractDevotionalParts = (
  text: string | string[] | Record<string, string> | null | undefined
): DevotionalParts => {
  if (!text) {
    return {
      verse: null,
      reference: null,
      introducaoParagraphs: [],
      topicos: [],
      conclusaoParagraphs: [],
      oracaoParagraphs: [],
    }
  }

  const contentStr = text.toString()

  // Inicializa o resultado com a estrutura completa
  const result: DevotionalParts = {
    verse: null,
    reference: null,
    introducaoParagraphs: [],
    topicos: [],
    conclusaoParagraphs: [],
    oracaoParagraphs: [],
  }

  // Extrai o versículo e a referência - suporta formatos em inglês e português
  // Formato em português: geralmente entre aspas
  const versiculoPtMatch = contentStr.match(
    /[""]([^""]+)[""][\s\S]*?([A-Za-zÀ-ÖØ-öø-ÿ]+\s\d+:\d+(-\d+)?)/i
  )

  // Formato em inglês: diferentes padrões possíveis
  const versiculoEnMatch =
    // Formato 1: Após "Bible Verses:" com asteriscos para versículo e referência
    contentStr.match(
      /Bible Verses?:[\s\S]*?\*\*([^*]+)\*\*[\s\S]*?\*\*([A-Za-z\s]+\d+:\d+(?:-\d+)?)\*\*/i
    ) ||
    // Formato 2: Asteriscos genéricos para versículo e referência
    contentStr.match(
      /\*\*([^*]+)\*\*[\s\S]*?\*\*([A-Za-z\s]+\d+:\d+(?:-\d+)?)\*\*/i
    ) ||
    // Formato 3: Número do versículo e referência (comum em formato NIV, ESV, etc.)
    contentStr.match(
      /(["'][^"']+["'])[\s\S]*?\(([A-Za-z\s]+\d+:\d+(?:-\d+)?(?:\s+[A-Z]+)?)\)/i
    ) ||
    // Formato 4: Texto do versículo sem aspas mas com referência entre parênteses
    contentStr.match(
      /(?:verse|scripture)[\s\S]{0,30}?([^"'\n]{10,150})[\s\S]{0,20}?\(([A-Za-z\s]+\d+:\d+(?:-\d+)?)\)/i
    )

  if (versiculoPtMatch) {
    result.verse = cleanMarkdown(versiculoPtMatch[1])
    result.reference = cleanMarkdown(versiculoPtMatch[2])
  } else if (versiculoEnMatch) {
    result.verse = cleanMarkdown(versiculoEnMatch[1])
    result.reference = cleanMarkdown(versiculoEnMatch[2])
  }

  // Extrai a introdução - suporta formato em português e inglês
  const introducaoPtMatch = contentStr.match(
    /INTRODUÇÃO:\s*([^]*?)(?=TÓPICO I:|$)/is
  )

  // Em inglês, a introdução pode estar em diferentes formatos
  const introducaoEnMatch =
    // Formato 1: Após "Introduction:" e antes de "Bible Verses:"
    contentStr.match(
      /Introduction:?\s*([^]*?)(?=Bible Verses?:|Reflection:|$)/is
    ) ||
    // Formato 2: No início do texto até "Bible Verses:" ou até reflexão, se não houver marcador explícito
    contentStr.match(
      /^(?:Title[:\s]*[^\n]*\n+)?([^]*?)(?=Bible Verses?:|Reflection:|1\.\s+[A-Z]|$)/is
    ) ||
    // Formato 3: Após o título até a primeira seção identificável
    contentStr.match(
      /^\*\*[^\n]*\*\*\s*\n\n([^]*?)(?=\*\*|Bible Verses?:|Reflection:|$)/is
    )

  if (introducaoPtMatch?.[1]) {
    result.introducaoParagraphs = introducaoPtMatch[1]
      .split(/\n+/)
      .filter((p: string) => p.trim().length > 0)
      .map((p: string) => cleanMarkdown(p.trim()))
  } else if (introducaoEnMatch?.[1]) {
    // Limpar possíveis títulos ou cabeçalhos no início da introdução
    let introText = introducaoEnMatch[1].trim()
    // Remover título se estiver no início da introdução
    introText = introText.replace(/^\*\*[^\n]*\*\*\s*\n+/, '')

    result.introducaoParagraphs = introText
      .split(/\n+/)
      .filter((p: string) => p.trim().length > 0 && !p.match(/^\s*\*\*/)) // Ignora linhas que são apenas títulos
      .map((p: string) => cleanMarkdown(p.trim()))
  }

  // Extrai os tópicos em português (pode haver mais de 3)
  const topicosPtRegex =
    /TÓPICO (I|II|III|IV|V|VI):\s*([^\n]+)([^]*?)(?=TÓPICO |CONCLUSÃO:|ORAÇÃO:|$)/gi
  let topicoPtMatch: RegExpExecArray | null

  // Use a separate variable for the loop condition check
  topicoPtMatch = topicosPtRegex.exec(contentStr)
  while (topicoPtMatch !== null) {
    const topicoTitulo = topicoPtMatch[2].trim()
    const topicoContent = topicoPtMatch[3].trim()

    // Get the next match for the next iteration
    topicoPtMatch = topicosPtRegex.exec(contentStr)

    // Divide o conteúdo do tópico em parágrafos
    const paragraphs = topicoContent
      .split(/\n+/)
      .filter((p: string) => p.trim().length > 0)
      .map((p: string) => cleanMarkdown(p.trim()))

    result.topicos.push({
      titulo: cleanMarkdown(topicoTitulo),
      paragraphs: paragraphs,
    })
  }

  // Extrai os tópicos em inglês (Reflection, Practical Application)
  const topicosEnReflection = contentStr.match(
    /Reflection:?\s*([^]*?)(?=Practical Application:|Closing Prayer:|$)/is
  )
  const topicosEnApplication = contentStr.match(
    /Practical Application:?\s*([^]*?)(?=Closing Prayer:|$)/is
  )

  if (topicosEnReflection?.[1]) {
    result.topicos.push({
      titulo: 'Reflection',
      paragraphs: topicosEnReflection[1]
        .split(/\n+/)
        .filter((p: string) => p.trim().length > 0)
        .map((p: string) => cleanMarkdown(p.trim())),
    })
  }

  if (topicosEnApplication?.[1]) {
    // Analisar se o conteúdo está em formato de lista numerada
    const applicationContent = topicosEnApplication[1].trim()
    const isNumberedList = /^\s*\d+\.\s+/m.test(applicationContent)

    if (isNumberedList) {
      // Extrai cada item da lista numerada como um parágrafo separado
      const listItems = applicationContent
        .split(/\n+/)
        .filter(line => line.trim().length > 0)
      const processedParagraphs: string[] = []

      for (const item of listItems) {
        const cleanItem = cleanMarkdown(item)
        if (cleanItem.trim()) {
          processedParagraphs.push(cleanItem)
        }
      }

      result.topicos.push({
        titulo: 'Practical Application',
        paragraphs: processedParagraphs,
      })
    } else {
      // Processamento padrão para texto não em formato de lista
      result.topicos.push({
        titulo: 'Practical Application',
        paragraphs: applicationContent
          .split(/\n+/)
          .filter((p: string) => p.trim().length > 0)
          .map((p: string) => cleanMarkdown(p.trim())),
      })
    }
  }

  // Extrai a conclusão - suporta formato em português
  const conclusaoPtMatch = contentStr.match(
    /CONCLUSÃO:\s*([^]*?)(?=ORAÇÃO:|$)/is
  )
  if (conclusaoPtMatch?.[1]) {
    result.conclusaoParagraphs = conclusaoPtMatch[1]
      .split(/\n+/)
      .filter((p: string) => p.trim().length > 0)
      .map((p: string) => cleanMarkdown(p.trim()))
  }

  // Extrai a oração - suporta formato em português e inglês
  const oracaoPtMatch = contentStr.match(/ORAÇÃO:\s*([^]*?)$/is)
  const oracaoEnMatch = contentStr.match(/Closing Prayer:?\s*([^]*?)$/is)

  if (oracaoPtMatch?.[1]) {
    result.oracaoParagraphs = oracaoPtMatch[1]
      .split(/\n+/)
      .filter((p: string) => p.trim().length > 0)
      .map((p: string) => cleanMarkdown(p.trim()))
  } else if (oracaoEnMatch?.[1]) {
    result.oracaoParagraphs = oracaoEnMatch[1]
      .split(/\n+/)
      .filter((p: string) => p.trim().length > 0)
      .map((p: string) => cleanMarkdown(p.trim()))
  }

  return result
}

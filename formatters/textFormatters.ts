/**
 * Funções de formatação de texto para o aplicativo Devocional Diário
 */

/**
 * Formata o título para exibição, capitalizando apenas a primeira palavra
 * @param rawTitle O título bruto a ser formatado
 * @returns O título formatado
 */
export const formatTitle = (rawTitle: string | string[] | null | undefined): string | null => {
  if (!rawTitle) return null;

  // Converter para string e remover aspas no início e fim
  let titleText = rawTitle.toString().trim();

  // Remover aspas (normais e curvas) no início e fim
  titleText = titleText.replace(/^["'""]|["'""]$/g, '');

  // Remover aspas duplas repetidas no início e fim (caso existam)
  titleText = titleText.replace(/^["'"'"'"]+|["'"'"'"]+$/g, '');

  // Última limpeza após remoção das aspas
  titleText = titleText.trim();

  // Dividir o título em palavras
  const words = titleText.split(' ');

  if (words.length === 0) return '';

  // Capitalizar apenas a primeira palavra
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();

  // Manter as demais palavras em minúsculas
  for (let i = 1; i < words.length; i++) {
    words[i] = words[i].toLowerCase();
  }

  // Juntar as palavras novamente
  return words.join(' ');
};

/**
 * Interface para estruturar o conteúdo formatado do devocional
 */
interface DevotionalParts {
  verse: string | null;
  reference: string | null;
  introducaoParagraphs: string[];
  topicos: Array<{
    titulo: string;
    paragraphs: string[];
  }>;
  conclusaoParagraphs: string[];
  oracaoParagraphs: string[];
}

/**
 * Formata o conteúdo do devocional para destacar versículos, introdução, tópicos, conclusão e orações
 * @param text O texto bruto do devocional
 * @returns Objeto estruturado com as diferentes partes do devocional
 */
export const extractDevotionalParts = (text: string | string[] | Record<string, string> | null | undefined): DevotionalParts => {
  if (!text) {
    return {
      verse: null,
      reference: null,
      introducaoParagraphs: [],
      topicos: [],
      conclusaoParagraphs: [],
      oracaoParagraphs: [],
    };
  }

  const contentStr = text.toString();

  // Inicializa o resultado com a estrutura completa
  const result: DevotionalParts = {
    verse: null,
    reference: null,
    introducaoParagraphs: [],
    topicos: [],
    conclusaoParagraphs: [],
    oracaoParagraphs: [],
  };

  // Extrai o versículo e a referência (geralmente no início, entre aspas)
  const versiculoMatch = contentStr.match(/[""]([^""]+)[""][\s\S]*?([A-Za-zÀ-ÖØ-öø-ÿ]+\s\d+:\d+(-\d+)?)/i);
  if (versiculoMatch) {
    result.verse = versiculoMatch[1];
    result.reference = versiculoMatch[2];
  }

  // Extrai a introdução
  const introducaoMatch = contentStr.match(/INTRODUÇÃO:\s*([^]*?)(?=TÓPICO I:|$)/is);
  if (introducaoMatch && introducaoMatch[1]) {
    result.introducaoParagraphs = introducaoMatch[1]
      .split(/\n+/)
      .filter((p: string) => p.trim().length > 0)
      .map((p: string) => p.trim());
  }

  // Extrai os tópicos (pode haver mais de 3)
  const topicosRegex = /TÓPICO (I|II|III|IV|V|VI):\s*([^\n]+)([^]*?)(?=TÓPICO |CONCLUSÃO:|ORAÇÃO:|$)/gi;
  let topicoMatch;

  while ((topicoMatch = topicosRegex.exec(contentStr)) !== null) {
    const topicoTitulo = topicoMatch[2].trim();
    const topicoContent = topicoMatch[3].trim();

    // Divide o conteúdo do tópico em parágrafos
    const paragraphs = topicoContent
      .split(/\n+/)
      .filter((p: string) => p.trim().length > 0)
      .map((p: string) => p.trim());

    result.topicos.push({
      titulo: topicoTitulo,
      paragraphs: paragraphs
    });
  }

  // Extrai a conclusão
  const conclusaoMatch = contentStr.match(/CONCLUSÃO:\s*([^]*?)(?=ORAÇÃO:|$)/is);
  if (conclusaoMatch && conclusaoMatch[1]) {
    result.conclusaoParagraphs = conclusaoMatch[1]
      .split(/\n+/)
      .filter((p: string) => p.trim().length > 0)
      .map((p: string) => p.trim());
  }

  // Extrai a oração
  const oracaoMatch = contentStr.match(/ORAÇÃO:\s*([^]*?)$/is);
  if (oracaoMatch && oracaoMatch[1]) {
    result.oracaoParagraphs = oracaoMatch[1]
      .split(/\n+/)
      .filter((p: string) => p.trim().length > 0)
      .map((p: string) => p.trim());
  }

  return result;
}; 
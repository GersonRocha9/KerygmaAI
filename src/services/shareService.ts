import { Share } from 'react-native'

/**
 * Compartilha um versículo bíblico
 * @param text O texto do versículo
 * @param reference A referência bíblica
 */
export const shareVerse = async (
  text: string,
  reference: string
): Promise<void> => {
  try {
    await Share.share({
      message: `"${text}" - ${reference}`,
      title: 'Compartilhar Versículo',
    })
  } catch (error) {
    console.error('Erro ao compartilhar versículo:', error)
  }
}

/**
 * Compartilha um devocional completo
 * @param content O conteúdo do devocional
 * @param title O título do devocional (opcional)
 */
export const shareDevotional = async (
  content: string,
  title?: string
): Promise<void> => {
  if (!content) return

  try {
    const shareTitle = title ? `Devocional: ${title}` : 'Devocional Diário'
    await Share.share({
      message: content.toString(),
      title: shareTitle,
    })
  } catch (error) {
    console.error('Erro ao compartilhar devocional:', error)
  }
}

import {
  extractDevotionalParts,
  formatTitle,
} from '@/formatters/textFormatters'

describe('formatTitle', () => {
  it('deve formatar corretamente um título básico', () => {
    expect(formatTitle('Título de Teste')).toBe('Título de teste')
  })

  it('deve remover aspas no início e fim do título', () => {
    expect(formatTitle('"Título de Teste"')).toBe('Título de teste')
    expect(formatTitle('"Título de Teste')).toBe('Título de teste')
    expect(formatTitle('Título de Teste"')).toBe('Título de teste')
  })

  it('deve lidar com null e undefined', () => {
    expect(formatTitle(null)).toBeNull()
    expect(formatTitle(undefined)).toBeNull()
  })

  it('deve converter arrays para string e formatar', () => {
    expect(formatTitle(['Título', 'de', 'Teste'])).toBe('Título,de,teste')
  })

  it('deve tratar títulos com múltiplas aspas', () => {
    expect(formatTitle('""Título de Teste""')).toBe('Título de teste')
  })
})

describe('extractDevotionalParts', () => {
  describe('formato português', () => {
    const devocionalPt = `
      "Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento." Provérbios 3:5

      INTRODUÇÃO:
      Este é um texto introdutório em português.
      Este é o segundo parágrafo da introdução.

      TÓPICO I: Primeiro tema
      Este é o conteúdo do primeiro tópico.

      TÓPICO II: Segundo tema
      Este é o conteúdo do segundo tópico.

      CONCLUSÃO:
      Esta é a conclusão do devocional.

      ORAÇÃO:
      Senhor, obrigado pela tua palavra.
      Amém.
    `

    it('deve extrair corretamente o versículo e referência em português', () => {
      const resultado = extractDevotionalParts(devocionalPt)
      expect(resultado.verse).toBe(
        'Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento.'
      )
      expect(resultado.reference).toBe('Provérbios 3:5')
    })

    it('deve extrair corretamente a introdução em português', () => {
      const resultado = extractDevotionalParts(devocionalPt)
      expect(resultado.introducaoParagraphs).toHaveLength(2)
      expect(resultado.introducaoParagraphs[0]).toBe(
        'Este é um texto introdutório em português.'
      )
      expect(resultado.introducaoParagraphs[1]).toBe(
        'Este é o segundo parágrafo da introdução.'
      )
    })

    it('deve extrair corretamente os tópicos em português', () => {
      const resultado = extractDevotionalParts(devocionalPt)
      expect(resultado.topicos).toHaveLength(2)
      expect(resultado.topicos[0].titulo).toBe('Primeiro tema')
      expect(resultado.topicos[0].paragraphs[0]).toBe(
        'Este é o conteúdo do primeiro tópico.'
      )
      expect(resultado.topicos[1].titulo).toBe('Segundo tema')
      expect(resultado.topicos[1].paragraphs[0]).toBe(
        'Este é o conteúdo do segundo tópico.'
      )
    })

    it('deve extrair corretamente a conclusão em português', () => {
      const resultado = extractDevotionalParts(devocionalPt)
      expect(resultado.conclusaoParagraphs).toHaveLength(1)
      expect(resultado.conclusaoParagraphs[0]).toBe(
        'Esta é a conclusão do devocional.'
      )
    })

    it('deve extrair corretamente a oração em português', () => {
      const resultado = extractDevotionalParts(devocionalPt)
      expect(resultado.oracaoParagraphs).toHaveLength(2)
      expect(resultado.oracaoParagraphs[0]).toBe(
        'Senhor, obrigado pela tua palavra.'
      )
      expect(resultado.oracaoParagraphs[1]).toBe('Amém.')
    })
  })

  describe('formato inglês', () => {
    const devocionalEn = `
      **Title: Love and Pray**

      **Introduction:**
      In the hustle and bustle of our daily lives, it can be easy to forget the two most powerful forces that connect us to God and to one another - love and prayer.
      The Bible teaches us that love is the foundation of our faith, and prayer is the key to our relationship with God.

      **Bible Verses:**
      **1 Corinthians 13:13 (NIV):** "And now these three remain: faith, hope and love. But the greatest of these is love."
      **Philippians 4:6 (NIV):** "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."

      **Reflection:**
      The verse from 1 Corinthians 13:13 reminds us of the centrality of love in our Christian walk.
      Love is not just an emotion; it is a choice, a decision to act in kindness, compassion, and selflessness towards others.

      **Practical Application:**
      1. **Love Unconditionally:** Today, make a conscious effort to show love to everyone you encounter.
      2. **Pray Continually:** Throughout your day, take moments to pause and offer up prayers to God.

      **Closing Prayer:**
      Dear Heavenly Father, thank you for the gift of love and prayer.
      Help us to love one another as you have loved us, selflessly and unconditionally.
    `

    it('deve extrair corretamente o versículo e referência em inglês', () => {
      const resultado = extractDevotionalParts(devocionalEn)

      // Versículo
      expect(resultado.verse).toContain(
        'And now these three remain: faith, hope and love'
      )

      // Se a referência existir, deve conter um texto de referência bíblica
      if (resultado.reference) {
        const temReferenciaValida =
          resultado.reference.includes('Corinthians') ||
          resultado.reference.includes('Philippians') ||
          resultado.reference.match(/\d+:\d+/) // Formato N:N de referência bíblica

        expect(temReferenciaValida).toBe(true)
      }
    })

    it('deve extrair corretamente a introdução em inglês', () => {
      const resultado = extractDevotionalParts(devocionalEn)
      expect(resultado.introducaoParagraphs).toHaveLength(2)
      expect(resultado.introducaoParagraphs[0]).toContain(
        'In the hustle and bustle of our daily lives'
      )
      expect(resultado.introducaoParagraphs[1]).toContain(
        'The Bible teaches us that love is the foundation'
      )
    })

    it('deve extrair corretamente os tópicos de reflexão em inglês', () => {
      const resultado = extractDevotionalParts(devocionalEn)

      const reflexao = resultado.topicos.find(t => t.titulo === 'Reflection')
      expect(reflexao).toBeDefined()
      if (reflexao) {
        expect(reflexao.paragraphs.length).toBeGreaterThan(0)
        const conteudoEncontrado = reflexao.paragraphs.some(
          p =>
            p.includes('Corinthians') ||
            p.includes('love') ||
            p.includes('Christian')
        )
        expect(conteudoEncontrado).toBe(true)
      }
    })

    it('deve extrair corretamente aplicação prática em inglês', () => {
      const resultado = extractDevotionalParts(devocionalEn)

      // Verifica se a aplicação prática foi extraída como um tópico
      const aplicacao = resultado.topicos.find(
        t => t.titulo === 'Practical Application'
      )
      expect(aplicacao).toBeDefined()
      expect(aplicacao?.paragraphs.length).toBeGreaterThan(0)
      expect(aplicacao?.paragraphs[0]).toContain('Love Unconditionally')
    })

    it('deve extrair corretamente a oração em inglês', () => {
      const resultado = extractDevotionalParts(devocionalEn)
      const temTextoEsperado = resultado.oracaoParagraphs.some(
        p => p.includes('Heavenly Father') || p.includes('thank you')
      )
      expect(temTextoEsperado).toBe(true)
    })
  })

  describe('limpeza de marcação markdown', () => {
    it('deve remover corretamente asteriscos duplos (negrito)', () => {
      const texto = 'Este é um **texto em negrito** que deve ser limpo'
      const resultado = extractDevotionalParts(texto)

      // Verifica se o texto foi incluído em alguma parte e se os ** foram removidos
      const todasPartes = [
        ...resultado.introducaoParagraphs,
        ...resultado.topicos.flatMap(t => t.paragraphs),
        ...resultado.conclusaoParagraphs,
        ...resultado.oracaoParagraphs,
      ]

      // Se o texto foi capturado, deve estar sem os asteriscos
      const textoCapturado = todasPartes.some(p =>
        p.includes('texto em negrito')
      )
      expect(textoCapturado).toBe(true)

      // Não deve haver asteriscos duplos em nenhuma parte
      const temAsteriscosDuplos = todasPartes.some(p => p.includes('**'))
      expect(temAsteriscosDuplos).toBe(false)
    })

    it('deve remover corretamente marcadores de lista', () => {
      const texto = `
        Introdução:
        - Item 1
        - Item 2
        1. Item numerado 1
        2. Item numerado 2
      `

      const resultado = extractDevotionalParts(texto)

      const textos = resultado.introducaoParagraphs
      expect(textos.some(t => t.startsWith('-'))).toBe(false)
      expect(textos.some(t => t.match(/^\d+\./))).toBe(false)
      expect(textos.some(t => t.includes('Item 1'))).toBe(true)
      expect(textos.some(t => t.includes('Item numerado 1'))).toBe(true)
    })
  })
})

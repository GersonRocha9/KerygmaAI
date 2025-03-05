/**
 * Lista de versículos inspiradores
 */
export const inspirationalVerses = [
  {
    text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    reference: "João 3:16",
  },
  {
    text: "Tudo posso naquele que me fortalece.",
    reference: "Filipenses 4:13",
  },
  {
    text: "O Senhor é o meu pastor, nada me faltará.",
    reference: "Salmos 23:1",
  },
  {
    text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.",
    reference: "Isaías 41:10",
  },
  {
    text: "Mas os que esperam no Senhor renovarão as forças, subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão.",
    reference: "Isaías 40:31",
  },
  {
    text: "E conhecereis a verdade, e a verdade vos libertará.",
    reference: "João 8:32",
  },
  {
    text: "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. Não maltrata, não procura seus interesses, não se ira facilmente, não guarda rancor.",
    reference: "1 Coríntios 13:4-5",
  },
  {
    text: "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.",
    reference: "Salmos 37:5",
  },
];

/**
 * Retorna um versículo aleatório da lista de versículos inspiradores
 * @returns Um versículo aleatório com texto e referência
 */
export const getRandomVerse = () => {
  const randomIndex = Math.floor(Math.random() * inspirationalVerses.length);
  return inspirationalVerses[randomIndex];
};
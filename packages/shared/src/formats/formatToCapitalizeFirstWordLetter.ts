/**
 * Formata uma frase capitalizando a primeira letra de cada palavra
 *
 * Esta função pega uma string e transforma a primeira letra de cada palavra
 * em maiúscula, enquanto o restante das letras ficam em minúscula.
 * As palavras são separadas por espaços.
 *
 * @param sentence - A frase a ser formatada
 * @returns A frase formatada com a primeira letra de cada palavra em maiúscula
 *
 * @example
 * ```typescript
 * // Exemplo básico
 * formatToCapitalizeFirstWordLetter("hello world");
 * // Retorna: "Hello World"
 *
 * // Com texto em maiúscula
 * formatToCapitalizeFirstWordLetter("HELLO WORLD");
 * // Retorna: "Hello World"
 *
 * // Com texto misturado
 * formatToCapitalizeFirstWordLetter("hELLo WoRLd");
 * // Retorna: "Hello World"
 *
 * // Com múltiplas palavras
 * formatToCapitalizeFirstWordLetter("javascript é uma linguagem incrível");
 * // Retorna: "Javascript É Uma Linguagem Incrível"
 *
 * // String vazia
 * formatToCapitalizeFirstWordLetter("");
 * // Retorna: ""
 * ```
 */
function formatToCapitalizeFirstWordLetter(sentence: string) {
  const words = sentence.split(" ");

  const capitalizedWords = words.map((word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();
    return firstLetter + restOfWord;
  });

  return capitalizedWords.join(" ");
}

export { formatToCapitalizeFirstWordLetter };

/**
 * Formats a sentence by capitalizing the first letter of each word.
 *
 * This function takes a string and capitalizes the first letter of each word
 * while the remaining letters are lowercase.
 * Words are separated by spaces.
 *
 * @param sentence - The sentence to be formatted.
 * @returns The sentence formatted with the first letter of each word capitalized.
 *
 * @example
 * ```typescript
 * // Basic example
 * formatToCapitalizeFirstWordLetter("hello world");
 * // Returns: "Hello World"
 *
 * // With capitalized text.
 * formatToCapitalizeFirstWordLetter("HELLO WORLD");
 * // Returns: "Hello World"
 *
 * // With mixed text.
 * formatToCapitalizeFirstWordLetter("hELLO WoRLd"); * // Returns: "Hello World"
 *
 * // With multiple words
 * formatToCapitalizeFirstWordLetter("javascript is an amazing language");
 * // Returns: "Javascript is an amazing language"
 *
 * // Empty string
 * formatToCapitalizeFirstWordLetter("");
 * // Returns: ""
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

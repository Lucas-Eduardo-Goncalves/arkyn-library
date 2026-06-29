/**
 * Capitalizes the first letter of each word and lowercases the rest.
 * Words are separated by spaces.
 *
 * @param sentence - The string to format.
 * @returns The sentence with every word title-cased.
 *
 * @example
 * ```typescript
 * formatToCapitalizeFirstWordLetter("hello world");  // "Hello World"
 * formatToCapitalizeFirstWordLetter("HELLO WORLD");  // "Hello World"
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

/**
 * Removes all non-numeric characters from a given string.
 *
 * @param {string} rawString - The input string from which non-numeric characters will be removed.
 *
 * @returns {string} A new string containing only numeric characters from the input.
 *
 * @example
 * ```typescript
 * const result = removeNonNumeric("abc123def456");
 * console.log(result); // Output: "123456"
 * ```
 */

function removeNonNumeric(rawString: string): string {
  return rawString.replace(/[^0-9]/g, "");
}

export { removeNonNumeric };

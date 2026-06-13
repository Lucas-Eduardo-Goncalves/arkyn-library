/**
 * Removes all non-numeric characters from a given string.
 *
 * @param rawString - The input string to strip non-numeric characters from.
 * @returns A new string containing only the numeric characters from the input.
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

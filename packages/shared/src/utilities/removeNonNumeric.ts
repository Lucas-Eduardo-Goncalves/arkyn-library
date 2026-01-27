type RemoveNonNumericFunction = (formattedValue: string) => string;

/**
 * Removes all non-numeric characters from a given string.
 *
 * @param prop - The input string from which non-numeric characters will be removed.
 * @returns A new string containing only numeric characters from the input.
 *
 * @example
 * ```typescript
 * const result = removeNonNumeric("abc123def456");
 * console.log(result); // Output: "123456"
 * ```
 */

const removeNonNumeric: RemoveNonNumericFunction = (prop) => {
  return prop.replace(/[^0-9]/g, "");
};

export { removeNonNumeric };

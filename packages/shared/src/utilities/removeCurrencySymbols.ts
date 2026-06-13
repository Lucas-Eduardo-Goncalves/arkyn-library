/**
 * Removes currency symbols from a given formatted string.
 *
 * This function takes a string that may contain currency symbols
 * and removes them using a regular expression. The resulting string
 * is also trimmed of any leading or trailing whitespace.
 *
 * @param rawString - The formatted string that may contain currency symbols.
 * @returns The string with all currency symbols removed and trimmed of whitespace.
 *
 * @example
 * ```typescript
 * removeCurrencySymbols("R$13,45"); // "13,45"
 * removeCurrencySymbols("$123.45"); // "123.45"
 * removeCurrencySymbols("€99.99"); // "99.99"
 * removeCurrencySymbols("¥1,000"); // "1,000"
 * removeCurrencySymbols("123.45"); // "123.45" (no symbols to remove)
 * ```
 */

function removeCurrencySymbols(rawString: string): string {
  return rawString.replace(/(?:R\$|\p{Sc}|[$€¥£])/gu, "").trim();
}

export { removeCurrencySymbols };

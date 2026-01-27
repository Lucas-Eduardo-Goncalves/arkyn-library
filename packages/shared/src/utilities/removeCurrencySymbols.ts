type RemoveCurrencySymbolsFunction = (formattedValue: string) => string;

/**
 * Removes currency symbols from a given formatted string.
 *
 * This function takes a string that may contain currency symbols
 * and removes them using a regular expression. The resulting string
 * is also trimmed of any leading or trailing whitespace.
 *
 * @param formattedValue - The input string containing currency symbols.
 * @returns A string with all currency symbols removed and trimmed of whitespace.
 *
 * @example
 * removeCurrencySymbols("R$13,45"); // "13,45"
 * removeCurrencySymbols("$123.45"); // "123.45"
 * removeCurrencySymbols("€99.99"); // "99.99"
 * removeCurrencySymbols("¥1,000"); // "1,000"
 * removeCurrencySymbols("123.45"); // "123.45" (no symbols to remove)
 */

const removeCurrencySymbols: RemoveCurrencySymbolsFunction = (
  formattedValue
) => {
  return formattedValue
    .replace(/(?:R\$|\p{Sc}|[$€¥£])/gu, "") // Inclui "R$" e outros símbolos comuns
    .trim();
};

export { removeCurrencySymbols };

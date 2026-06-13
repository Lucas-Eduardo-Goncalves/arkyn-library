/**
 * Ensures that a given rawValue string is enclosed in quotes.
 *
 * This function checks if the input string is already enclosed in either single
 * quotes (`'`) or double quotes (`"`). If the string is already quoted, it is
 * returned as-is. Otherwise, the function wraps the string in double quotes.
 *
 * @param rawValue - The string to be checked and potentially quoted.
 * @returns The original string if already quoted, otherwise the string wrapped in double quotes.
 *
 * @example
 * ```typescript
 * ensureQuotes('example'); // Returns: '"example"'
 * ensureQuotes('"already quoted"'); // Returns: '"already quoted"'
 * ensureQuotes("'single quoted'"); // Returns: "'single quoted'"
 * ```
 */

function ensureQuotes(rawValue: string): string {
  const hasSingleQuotes = rawValue.startsWith("'") && rawValue.endsWith("'");
  const hasDoubleQuotes = rawValue.startsWith('"') && rawValue.endsWith('"');

  if (hasSingleQuotes || hasDoubleQuotes) {
    return rawValue;
  }

  return `"${rawValue}"`;
}

export { ensureQuotes };

type EnsureQuotesFunction = (rawValue: string) => string;

/**
 * Ensures that a given rawValue string is enclosed in quotes.
 *
 * This function checks if the input string is already enclosed in either single
 * quotes (`'`) or double quotes (`"`). If the string is already quoted, it is
 * returned as-is. Otherwise, the function wraps the string in double quotes.
 *
 * @param url - The URL string to be checked and potentially quoted.
 * @returns The input string, either unchanged if it is already quoted, or wrapped in double quotes.
 */

const ensureQuotes: EnsureQuotesFunction = (rawValue) => {
  const hasSingleQuotes = rawValue.startsWith("'") && rawValue.endsWith("'");
  const hasDoubleQuotes = rawValue.startsWith('"') && rawValue.endsWith('"');

  if (hasSingleQuotes || hasDoubleQuotes) {
    return rawValue;
  }

  return `"${rawValue}"`;
};

export { ensureQuotes };

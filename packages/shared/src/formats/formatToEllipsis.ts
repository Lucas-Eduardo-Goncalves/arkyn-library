/**
 * Truncates a given text to a specified maximum length and appends an ellipsis ("...")
 * if the text exceeds the maximum length.
 *
 * @param {string} text - The input string to be truncated.
 *
 * @param {number} maxLength - The maximum allowed length of the string before truncation.
 *
 * @returns {string} The truncated string with an ellipsis if the input exceeds the maximum length,
 *          or the original string if it does not.
 * @example
 * ```typescript
 * const result = formatToEllipsis("Hello, world!", 5);
 * console.log(result); // Output: "Hello..."
 * ```
 */

const formatToEllipsis = (text: string, maxLength: number): string => {
  if (text.length > maxLength) {
    let trimmedText = text.substring(0, maxLength);

    // Find the last space to avoid breaking words
    const lastSpaceIndex = trimmedText.lastIndexOf(" ");
    if (lastSpaceIndex > 0) {
      trimmedText = trimmedText.substring(0, lastSpaceIndex);
    }

    // Remove trailing punctuation
    trimmedText = trimmedText.replace(/[\s.,!?;:]+$/, "");

    // If after removing punctuation the text is empty or only contains punctuation/spaces, return only "..."
    if (trimmedText.trim().length === 0 || /^[.,!?;:\s]+$/.test(trimmedText)) {
      return "...";
    }

    return `${trimmedText}...`;
  }

  return text;
};

export { formatToEllipsis };

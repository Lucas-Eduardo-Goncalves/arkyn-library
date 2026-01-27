/**
 * Strips HTML tags from a string.
 *
 * This function removes all HTML tags from the provided string by replacing any content
 * that matches the HTML tag pattern with an empty string.
 *
 * @param {string} rawHtml - The HTML string to be processed
 *
 * @returns {string} The input string with all HTML tags removed
 *
 * @example
 * ```typescript
 * const strippedHtml = stripHtmlTags("<p>Hello <strong>World</strong></p>");
 * console.log(strippedHtml); // "Hello World"
 * ```
 */

function stripHtmlTags(rawHtml: string): string {
  return rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?[a-z][a-z0-9]*[^>]*>/gi, "");
}

export { stripHtmlTags };

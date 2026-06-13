/**
 * Check if a string contains HTML markup.
 *
 * This function uses a regular expression to detect the presence of HTML tags
 * in a string. The check is case-insensitive and detects both opening
 * and closing tags.
 *
 * @param rawString - The string to check.
 * @returns `true` if the string contains HTML markup, `false` otherwise.
 *
 * @example
 * ```typescript
 * isHtml('<p>Hello world</p>'); // true
 * isHtml('<div>Content</div>'); // true
 * isHtml('Plain text'); // false
 * isHtml(''); // false
 * ```
 */

function isHtml(rawString: string): boolean {
  const htmlRegex = /<\/?[a-z][\s\S]*>/i;
  return htmlRegex.test(rawString);
}

export { isHtml };

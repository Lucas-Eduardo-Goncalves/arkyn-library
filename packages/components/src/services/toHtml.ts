import { RichTextValue } from "../types/richTextTypes";
import { serialize } from "../utils/richTextUtilities";

/**
 * Converts a RichTextValue array to HTML string format.
 *
 * @param {RichTextValue} richTextValue - Array of Descendant objects representing rich text content
 * @returns {string} HTML string representation of the rich text content
 *
 * @example
 * ```typescript
 * const richTextService = new RichTextService();
 * const richText = [
 *   { type: 'paragraph', children: [{ text: 'Hello world', bold: true }] }
 * ];
 * const html = richTextService.toHtml(richText);
 * // Returns: "<p><strong>Hello world</strong></p>"
 * ```
 */

function toHtml(richTextValue: RichTextValue) {
  return richTextValue.map((node) => serialize(node)).join("");
}

export { toHtml };

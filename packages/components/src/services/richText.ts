import parse from "html-react-parser";

import { ParseElement, RichTextValue } from "../types/richTextTypes";
import { deserialize, serialize } from "../utils/richTextUtilities";

class RichTextService {
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

  static toHtml(richTextValue: RichTextValue) {
    return richTextValue.map((node) => serialize(node)).join("");
  }

  /**
   * Converts an HTML string to RichTextValue format.
   * Parses the HTML content and transforms it into an array of Descendant objects
   * that can be used by the rich text editor.
   *
   * @param {string} html - HTML string to be converted to rich text format
   * @returns {RichTextValue} Array of Descendant objects representing the parsed content
   *
   * @example
   * ```typescript
   * const richTextService = new RichTextService();
   * const html = "<p><strong>Hello world</strong></p>";
   * const richText = richTextService.toRichTextValue(html);
   * // Returns: [{ type: 'paragraph', children: [{ text: 'Hello world', bold: true }] }]
   * ```
   *
   * @example
   * ```typescript
   * // Handling plain text
   * const plainText = "Simple text";
   * const richText = richTextService.toRichTextValue(plainText);
   * // Returns: [{ text: 'Simple text' }]
   * ```
   */

  static toRichTextValue(html: string): RichTextValue {
    const parsed = parse(html);

    if (Array.isArray(parsed)) {
      return parsed.map((node) => {
        if (typeof node === "string") return { text: node };
        return deserialize(node as ParseElement);
      });
    }

    if (typeof parsed === "string") return [{ text: parsed }];
    return [deserialize(parsed as ParseElement)];
  }
}

export { RichTextService };

import type { RichTextValue } from "../types/richTextTypes";
import { serialize } from "../utils/richTextUtilities";

/**
 * toHtml — converts a `RichTextValue` (Slate.js Descendant array) to an HTML string.
 *
 * Use this to persist or display the editor's content as plain HTML.
 *
 * @param richTextValue - The value from a `RichText` component's `onChange` callback.
 * @returns HTML string representation of the rich text content.
 *
 * @example
 * ```tsx
 * const [content, setContent] = useState<RichTextValue>([]);
 *
 * // On form submit, convert to HTML for storage
 * const html = toHtml(content);
 * // e.g. "<p><strong>Hello world</strong></p>"
 * ```
 */

function toHtml(richTextValue: RichTextValue): string {
	return richTextValue.map((node) => serialize(node)).join("");
}

export { toHtml };

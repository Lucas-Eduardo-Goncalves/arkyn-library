import parse from "html-react-parser";

import type { ParseElement, RichTextValue } from "../types/richTextTypes";
import { deserialize } from "../utils/richTextUtilities";

/**
 * toRichTextValue — converts an HTML string to a `RichTextValue` (Slate.js Descendant array).
 *
 * Use this to populate a `RichText` editor with content previously stored as HTML
 * (e.g. loaded from a database).
 *
 * @param html - HTML string to convert.
 * @returns Slate.js Descendant array ready to pass to `RichText`'s `defaultValue` prop.
 *
 * @example
 * ```tsx
 * // Load stored HTML into the editor
 * const defaultValue = toRichTextValue(product.description);
 * // e.g. [{ type: 'paragraph', children: [{ text: 'Hello', bold: true }] }]
 *
 * <RichText name="description" defaultValue={defaultValue} />
 * ```
 */

function toRichTextValue(html: string): RichTextValue {
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

export { toRichTextValue };

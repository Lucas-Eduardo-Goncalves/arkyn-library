import { filterXSS } from "xss";

const ALLOWED_TAGS = ["b", "strong", "i", "em", "u", "br", "span", "small"];

// No attributes are allowed on any tag, which removes the need to
// separately vet href/src/style values.
const WHITE_LIST = Object.fromEntries(ALLOWED_TAGS.map((tag) => [tag, []]));

/**
 * sanitizeTooltipHtml, strips any markup outside a small inline-formatting
 * allowlist so `Tooltip`'s `text` prop can safely accept HTML from
 * consumers without executing scripts or attribute-based payloads
 * (`<script>`, `onerror`, `onclick`, `javascript:` URLs, etc.).
 *
 * Uses `xss` rather than `sanitize-html`: both are real, well-established
 * HTML sanitizers, but `sanitize-html` pulls in `postcss` (for `style`
 * attribute parsing) which assumes a Node `process` global and breaks when
 * this package is bundled for a real-browser test/runtime environment.
 * `xss` has no such dependency and explicitly supports running in a
 * browser.
 */
function sanitizeTooltipHtml(text: string): string {
	return filterXSS(text, {
		whiteList: WHITE_LIST,
		stripIgnoreTagBody: [
			"script",
			"style",
			"iframe",
			"object",
			"embed",
			"noscript",
		],
	});
}

export { sanitizeTooltipHtml };

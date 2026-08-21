/**
 * Strips HTML tags from a string for display/formatting purposes.
 *
 * This function removes content that matches common HTML tag patterns (including
 * `<script>`/`<style>` blocks and HTML comments) using regular expressions, and
 * returns the remaining text as-is.
 *
 * IMPORTANT - this is NOT a security sanitizer:
 * - It is a best-effort, regex-based text transform intended for stripping markup
 *   from trusted or display-only content (e.g. generating plain-text previews/excerpts).
 * - It does NOT guarantee removal of all constructs that a browser can execute as
 *   markup or script (e.g. malformed/broken tags, unusual nesting, or other
 *   HTML-parser edge cases can slip through the regexes below).
 * - It does NOT decode or escape HTML entities, so entity-encoded content is passed
 *   through unchanged.
 * - Do NOT rely on this function as an XSS defense or as the sole safeguard before
 *   rendering untrusted input as HTML (e.g. via `dangerouslySetInnerHTML` or
 *   equivalent). If you need to render untrusted HTML safely, use a dedicated,
 *   maintained HTML sanitizer library instead. This function is only safe to use
 *   for producing plain text from content you already trust, or purely cosmetic
 *   display purposes where script execution is not a concern.
 *
 * @param rawHtml - The HTML string to strip tags from.
 * @returns The plain text with matched HTML tags (including `<script>`, `<style>`, and comments) removed.
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

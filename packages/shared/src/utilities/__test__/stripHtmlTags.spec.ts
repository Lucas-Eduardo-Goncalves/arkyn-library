import { describe, expect, it } from "vitest";
import { stripHtmlTags } from "../stripHtmlTags";

describe("stripHtmlTags", () => {
	it("should remove simple HTML tags", () => {
		expect(stripHtmlTags("<p>Hello World</p>")).toBe("Hello World");
		expect(stripHtmlTags("<div>Content</div>")).toBe("Content");
		expect(stripHtmlTags("<span>Text</span>")).toBe("Text");
	});

	it("should remove nested HTML tags", () => {
		expect(stripHtmlTags("<p>Hello <strong>World</strong></p>")).toBe(
			"Hello World",
		);
		expect(stripHtmlTags("<div><p>Nested</p></div>")).toBe("Nested");
	});

	it("should remove self-closing tags", () => {
		expect(stripHtmlTags("Line 1<br />Line 2")).toBe("Line 1Line 2");
		expect(stripHtmlTags("Image<img src='test.jpg' />Text")).toBe("ImageText");
	});

	it("should remove tags with attributes", () => {
		expect(stripHtmlTags('<a href="https://example.com">Link</a>')).toBe(
			"Link",
		);
		expect(
			stripHtmlTags('<div class="container" id="main">Content</div>'),
		).toBe("Content");
		expect(stripHtmlTags('<img src="image.jpg" alt="description" />')).toBe("");
	});

	it("should handle empty string", () => {
		expect(stripHtmlTags("")).toBe("");
	});

	it("should handle plain text without tags", () => {
		expect(stripHtmlTags("Plain text")).toBe("Plain text");
		expect(stripHtmlTags("No HTML here")).toBe("No HTML here");
	});

	it("should handle multiple tags on same line", () => {
		expect(stripHtmlTags("<p>Text</p><div>More</div><span>End</span>")).toBe(
			"TextMoreEnd",
		);
	});

	it("should preserve spaces between content", () => {
		expect(stripHtmlTags("<p>Hello</p> <p>World</p>")).toBe("Hello World");
	});

	it("should handle tags with line breaks", () => {
		expect(stripHtmlTags("<div>\n  <p>Content</p>\n</div>")).toBe(
			"\n  Content\n",
		);
	});

	it("should remove HTML comments", () => {
		expect(stripHtmlTags("<!-- Comment --><p>Text</p>")).toBe("Text");
		expect(stripHtmlTags("Text<!-- Hidden -->More")).toBe("TextMore");
	});

	it("should handle incomplete or malformed tags", () => {
		expect(stripHtmlTags("<p>Incomplete")).toBe("Incomplete");
		expect(stripHtmlTags("Text<br>More")).toBe("TextMore");
	});

	it("should handle script tags", () => {
		expect(stripHtmlTags("<script>alert('test');</script>Text")).toBe("Text");
	});

	it("should handle style tags", () => {
		expect(stripHtmlTags("<style>.class { color: red; }</style>Text")).toBe(
			"Text",
		);
	});

	it("should handle mixed content", () => {
		expect(stripHtmlTags("Start <b>bold</b> middle <i>italic</i> end")).toBe(
			"Start bold middle italic end",
		);
	});

	it("should handle uppercase tags", () => {
		expect(stripHtmlTags("<DIV>Content</DIV>")).toBe("Content");
		expect(stripHtmlTags("<P>Paragraph</P>")).toBe("Paragraph");
	});

	it("should handle mixed case tags", () => {
		expect(stripHtmlTags("<DiV>Content</DiV>")).toBe("Content");
	});

	it("should handle deeply nested structures", () => {
		expect(stripHtmlTags("<div><ul><li><p>Item</p></li></ul></div>")).toBe(
			"Item",
		);
	});

	it("should preserve HTML entities", () => {
		expect(stripHtmlTags("<p>&nbsp;&copy;&amp;</p>")).toBe("&nbsp;&copy;&amp;");
	});

	it("should handle tags with data attributes", () => {
		expect(
			stripHtmlTags('<div data-id="123" data-name="test">Content</div>'),
		).toBe("Content");
	});

	it("should handle multiple spaces in tags", () => {
		expect(stripHtmlTags("<p   class='test'  >Content</p>")).toBe("Content");
	});

	it("should handle empty tags", () => {
		expect(stripHtmlTags("<p></p>")).toBe("");
		expect(stripHtmlTags("<div><span></span></div>")).toBe("");
	});

	it("should handle text with < and > symbols that are not tags", () => {
		expect(stripHtmlTags("5 < 10 and 20 > 15")).toBe("5 < 10 and 20 > 15");
	});

	it("should handle long HTML content", () => {
		const html = `<div>${"<p>Paragraph</p>".repeat(100)}</div>`;
		const result = stripHtmlTags(html);
		expect(result).toBe("Paragraph".repeat(100));
	});
});

import { describe, expect, it } from "vitest";
import { isHtml } from "../isHtml";

describe("isHtml", () => {
	it("should return true for simple HTML tags", () => {
		expect(isHtml("<p>Hello world</p>")).toBe(true);
		expect(isHtml("<div>Content</div>")).toBe(true);
		expect(isHtml("<span>Text</span>")).toBe(true);
	});

	it("should return true for self-closing tags", () => {
		expect(isHtml("<br />")).toBe(true);
		expect(isHtml("<img />")).toBe(true);
		expect(isHtml("<input />")).toBe(true);
	});

	it("should return true for tags with attributes", () => {
		expect(isHtml('<div class="container">Content</div>')).toBe(true);
		expect(isHtml('<a href="https://example.com">Link</a>')).toBe(true);
		expect(isHtml('<img src="image.jpg" alt="description" />')).toBe(true);
	});

	it("should return true for closing tags only", () => {
		expect(isHtml("</div>")).toBe(true);
		expect(isHtml("</p>")).toBe(true);
		expect(isHtml("</span>")).toBe(true);
	});

	it("should return true for opening tags only", () => {
		expect(isHtml("<div>")).toBe(true);
		expect(isHtml("<p>")).toBe(true);
		expect(isHtml("<span>")).toBe(true);
	});

	it("should return false for plain text", () => {
		expect(isHtml("Plain text")).toBe(false);
		expect(isHtml("Hello world")).toBe(false);
		expect(isHtml("Just some content")).toBe(false);
	});

	it("should return false for empty string", () => {
		expect(isHtml("")).toBe(false);
	});

	it("should return true for text with inline HTML", () => {
		expect(isHtml("Text with <b>bold</b>")).toBe(true);
		expect(isHtml("Some <em>emphasized</em> text")).toBe(true);
		expect(isHtml("Click <a href='#'>here</a> for more")).toBe(true);
	});

	it("should return true for nested HTML tags", () => {
		expect(isHtml("<div><p>Nested content</p></div>")).toBe(true);
		expect(isHtml("<ul><li>Item 1</li><li>Item 2</li></ul>")).toBe(true);
	});

	it("should return true for HTML with line breaks", () => {
		expect(isHtml("<div>\n  <p>Content</p>\n</div>")).toBe(true);
	});

	it("should return true for uppercase tags", () => {
		expect(isHtml("<DIV>Content</DIV>")).toBe(true);
		expect(isHtml("<P>Paragraph</P>")).toBe(true);
	});

	it("should return true for mixed case tags", () => {
		expect(isHtml("<DiV>Content</DiV>")).toBe(true);
		expect(isHtml("<SpAn>Text</SpAn>")).toBe(true);
	});

	it("should return false for strings with < or > but not valid tags", () => {
		expect(isHtml("5 < 10")).toBe(false);
		expect(isHtml("10 > 5")).toBe(false);
		expect(isHtml("x < y and z > w")).toBe(false);
	});

	it("should return false for incomplete tags", () => {
		expect(isHtml("<")).toBe(false);
		expect(isHtml(">")).toBe(false);
		expect(isHtml("<>")).toBe(false);
	});

	it("should return true for HTML5 semantic tags", () => {
		expect(isHtml("<header>Header content</header>")).toBe(true);
		expect(isHtml("<footer>Footer content</footer>")).toBe(true);
		expect(isHtml("<article>Article content</article>")).toBe(true);
		expect(isHtml("<section>Section content</section>")).toBe(true);
	});

	it("should return true for tags with multiple attributes", () => {
		expect(isHtml('<input type="text" name="username" id="user" />')).toBe(
			true,
		);
		expect(
			isHtml(
				'<button class="btn" data-id="123" onclick="handleClick()">Click</button>',
			),
		).toBe(true);
	});

	it("should return false for HTML comments", () => {
		expect(isHtml("<!-- This is a comment -->")).toBe(false);
	});

	it("should return false for strings that look like tags but aren't", () => {
		expect(isHtml("< div >")).toBe(false);
		expect(isHtml("< / div >")).toBe(false);
	});

	it("should return true for HTML entities within tags", () => {
		expect(isHtml("<p>&nbsp;</p>")).toBe(true);
		expect(isHtml("<div>&copy; 2024</div>")).toBe(true);
	});

	it("should return true for script and style tags", () => {
		expect(isHtml("<script>console.log('hello');</script>")).toBe(true);
		expect(isHtml("<style>.class { color: red; }</style>")).toBe(true);
	});
});

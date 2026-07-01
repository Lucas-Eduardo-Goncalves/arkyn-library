import { describe, expect, it } from "vitest";
import { toRichTextValue } from "../toRichTextValue";

describe("toRichTextValue", () => {
	it("should convert a plain paragraph with an align class", () => {
		expect(toRichTextValue('<p class="align_left">Hello</p>')).toEqual([
			{ type: "paragraph", align: "left", children: [{ text: "Hello" }] },
		]);
	});

	it("should convert plain text with no tags into a single text node", () => {
		expect(toRichTextValue("plain text no tags")).toEqual([
			{ text: "plain text no tags" },
		]);
	});

	it("should convert bold text inside a paragraph", () => {
		expect(
			toRichTextValue('<p class="align_left">Hello <strong>world</strong></p>'),
		).toEqual([
			{
				type: "paragraph",
				align: "left",
				children: [{ text: "Hello " }, { text: "world", bold: true }],
			},
		]);
	});

	it("should convert italic, underline and code marks", () => {
		expect(
			toRichTextValue(
				"<p><em>italic</em><u>underline</u><code>code</code></p>",
			),
		).toEqual([
			{
				type: "paragraph",
				align: undefined,
				children: [
					{ text: "italic", italic: true },
					{ text: "underline", underline: true },
					{ text: "code", code: true },
				],
			},
		]);
	});

	it("should convert a bulleted list with list items", () => {
		expect(
			toRichTextValue('<ul class="align_center"><li>One</li><li>Two</li></ul>'),
		).toEqual([
			{
				type: "bulletedList",
				align: "center",
				children: [
					{ type: "listItem", align: undefined, children: [{ text: "One" }] },
					{ type: "listItem", align: undefined, children: [{ text: "Two" }] },
				],
			},
		]);
	});

	it("should convert a numbered list with multiple items", () => {
		expect(toRichTextValue("<ol><li>First</li><li>Second</li></ol>")).toEqual([
			{
				type: "numberedList",
				align: undefined,
				children: [
					{ type: "listItem", align: undefined, children: [{ text: "First" }] },
					{
						type: "listItem",
						align: undefined,
						children: [{ text: "Second" }],
					},
				],
			},
		]);
	});

	it("should not deserialize a lone list item when it is the list's only child", () => {
		const [result] = toRichTextValue("<ol><li>First</li></ol>");
		const { children } = result as { children: unknown[] };

		expect(children).toHaveLength(1);
		expect(children[0]).not.toEqual({
			type: "listItem",
			align: undefined,
			children: [{ text: "First" }],
		});
	});

	it("should convert headings and blockquotes", () => {
		expect(toRichTextValue("<h1>Title</h1>")).toEqual([
			{ type: "headingOne", align: undefined, children: [{ text: "Title" }] },
		]);
		expect(toRichTextValue("<h2>Subtitle</h2>")).toEqual([
			{
				type: "headingTwo",
				align: undefined,
				children: [{ text: "Subtitle" }],
			},
		]);
		expect(toRichTextValue("<blockquote>Quote</blockquote>")).toEqual([
			{ type: "blockQuote", align: undefined, children: [{ text: "Quote" }] },
		]);
	});

	it("should convert an image tag with its src and align class", () => {
		expect(
			toRichTextValue(
				'<img src="https://example.com/a.png" class="align_right" />',
			),
		).toEqual([
			{
				type: "image",
				align: "right",
				src: "https://example.com/a.png",
				children: [{ text: "" }],
			},
		]);
	});

	it("should convert multiple top-level nodes into an array", () => {
		expect(toRichTextValue("<p>A</p><p>B</p>")).toEqual([
			{ type: "paragraph", align: undefined, children: [{ text: "A" }] },
			{ type: "paragraph", align: undefined, children: [{ text: "B" }] },
		]);
	});

	it("should return an empty array for an empty string", () => {
		expect(toRichTextValue("")).toEqual([]);
	});

	it("should be the inverse of toHtml for a simple paragraph", () => {
		const html = '<p class="align_left">Round trip</p>';
		expect(toRichTextValue(html)).toEqual([
			{ type: "paragraph", align: "left", children: [{ text: "Round trip" }] },
		]);
	});
});

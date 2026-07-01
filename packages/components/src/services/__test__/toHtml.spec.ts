import { describe, expect, it } from "vitest";
import type { RichTextValue } from "../../types/richTextTypes";
import { toHtml } from "../toHtml";

describe("toHtml", () => {
	it("should render a plain paragraph", () => {
		const value: RichTextValue = [
			{ type: "paragraph", children: [{ text: "Hello world" }] },
		];

		expect(toHtml(value)).toBe('<p class="align_left">Hello world</p>');
	});

	it("should wrap bold text in a strong tag", () => {
		const value: RichTextValue = [
			{ type: "paragraph", children: [{ text: "Hello", bold: true }] },
		];

		expect(toHtml(value)).toBe(
			'<p class="align_left"><strong>Hello</strong></p>',
		);
	});

	it("should wrap italic, underline and code marks correctly", () => {
		const value: RichTextValue = [
			{
				type: "paragraph",
				children: [
					{ text: "italic", italic: true },
					{ text: "underline", underline: true },
					{ text: "code", code: true },
				],
			},
		];

		expect(toHtml(value)).toBe(
			'<p class="align_left"><em>italic</em><u>underline</u><code>code</code></p>',
		);
	});

	it("should combine multiple marks on the same text node", () => {
		const value: RichTextValue = [
			{
				type: "paragraph",
				children: [{ text: "styled", bold: true, italic: true }],
			},
		];

		expect(toHtml(value)).toBe(
			'<p class="align_left"><em><strong>styled</strong></em></p>',
		);
	});

	it("should apply the align class from the node's align property", () => {
		const value: RichTextValue = [
			{ type: "paragraph", align: "center", children: [{ text: "Hi" }] },
		];

		expect(toHtml(value)).toBe('<p class="align_center">Hi</p>');
	});

	it("should default to align_left when no align is set", () => {
		const value: RichTextValue = [
			{ type: "blockQuote", children: [{ text: "Quote" }] },
		];

		expect(toHtml(value)).toBe(
			'<blockquote class="align_left">Quote</blockquote>',
		);
	});

	it("should render nested lists with list items", () => {
		const value: RichTextValue = [
			{
				type: "bulletedList",
				children: [
					{ type: "listItem", children: [{ text: "One" }] },
					{ type: "listItem", children: [{ text: "Two" }] },
				],
			},
		];

		expect(toHtml(value)).toBe(
			'<ul class="align_left"><li class="align_left">One</li><li class="align_left">Two</li></ul>',
		);
	});

	it("should render a numbered list", () => {
		const value: RichTextValue = [
			{
				type: "numberedList",
				children: [{ type: "listItem", children: [{ text: "First" }] }],
			},
		];

		expect(toHtml(value)).toBe(
			'<ol class="align_left"><li class="align_left">First</li></ol>',
		);
	});

	it("should render headings", () => {
		const value: RichTextValue = [
			{ type: "headingOne", children: [{ text: "Title" }] },
			{ type: "headingTwo", children: [{ text: "Subtitle" }] },
		];

		expect(toHtml(value)).toBe(
			'<h1 class="align_left">Title</h1><h2 class="align_left">Subtitle</h2>',
		);
	});

	it("should render an image with its src and align class", () => {
		const value: RichTextValue = [
			{
				type: "image",
				align: "right",
				src: "https://example.com/a.png",
				children: [{ text: "" }],
			},
		];

		expect(toHtml(value)).toBe(
			'<img src="https://example.com/a.png" class="align_right" />',
		);
	});

	it("should render a video as an iframe", () => {
		const value: RichTextValue = [
			{
				type: "video",
				src: "https://example.com/video.mp4",
				children: [{ text: "" }],
			},
		];

		expect(toHtml(value)).toBe(
			'<iframe src="https://example.com/video.mp4" class="align_left" />',
		);
	});

	it("should concatenate multiple top-level nodes", () => {
		const value: RichTextValue = [
			{ type: "paragraph", children: [{ text: "A" }] },
			{ type: "paragraph", children: [{ text: "B" }] },
		];

		expect(toHtml(value)).toBe(
			'<p class="align_left">A</p><p class="align_left">B</p>',
		);
	});

	it("should return an empty string for an empty value", () => {
		expect(toHtml([])).toBe("");
	});

	it("should not mutate the input value", () => {
		const value: RichTextValue = [
			{ type: "paragraph", children: [{ text: "Immutable" }] },
		];
		const snapshot = JSON.parse(JSON.stringify(value));

		toHtml(value);

		expect(value).toEqual(snapshot);
	});
});

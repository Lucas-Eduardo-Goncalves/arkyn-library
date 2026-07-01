import { describe, expect, it } from "vitest";
import type { ParseElement } from "../../types/richTextTypes";
import { deserialize, serialize } from "../richTextUtilities";

describe("serialize", () => {
	it("should serialize plain text", () => {
		expect(serialize({ text: "Hello" })).toBe("Hello");
	});

	it("should wrap bold text in strong tags", () => {
		expect(serialize({ text: "Hello", bold: true })).toBe(
			"<strong>Hello</strong>",
		);
	});

	it("should wrap code, italic and underline marks", () => {
		expect(serialize({ text: "code", code: true })).toBe("<code>code</code>");
		expect(serialize({ text: "italic", italic: true })).toBe("<em>italic</em>");
		expect(serialize({ text: "underline", underline: true })).toBe(
			"<u>underline</u>",
		);
	});

	it("should nest multiple marks on the same text node", () => {
		expect(serialize({ text: "styled", bold: true, italic: true })).toBe(
			"<em><strong>styled</strong></em>",
		);
	});

	it("should serialize a paragraph element with its children", () => {
		expect(
			serialize({ type: "paragraph", children: [{ text: "Hello" }] }),
		).toBe('<p class="align_left">Hello</p>');
	});

	it("should default to align_left when no align is set", () => {
		expect(
			serialize({ type: "paragraph", children: [{ text: "Hi" }] }),
		).toContain('class="align_left"');
	});

	it("should use the node's align property when provided", () => {
		expect(
			serialize({
				type: "paragraph",
				align: "right",
				children: [{ text: "Hi" }],
			}),
		).toBe('<p class="align_right">Hi</p>');
	});

	it("should serialize an image element", () => {
		expect(
			serialize({ type: "image", src: "https://x.com/a.png", children: [] }),
		).toBe('<img src="https://x.com/a.png" class="align_left" />');
	});

	it("should serialize a video element as an iframe", () => {
		expect(
			serialize({ type: "video", src: "https://x.com/a.mp4", children: [] }),
		).toBe('<iframe src="https://x.com/a.mp4" class="align_left" />');
	});

	it("should serialize block quotes, lists and headings", () => {
		expect(serialize({ type: "blockQuote", children: [{ text: "Q" }] })).toBe(
			'<blockquote class="align_left">Q</blockquote>',
		);
		expect(
			serialize({
				type: "bulletedList",
				children: [{ type: "listItem", children: [{ text: "Item" }] }],
			}),
		).toBe('<ul class="align_left"><li class="align_left">Item</li></ul>');
		expect(
			serialize({
				type: "numberedList",
				children: [{ type: "listItem", children: [{ text: "Item" }] }],
			}),
		).toBe('<ol class="align_left"><li class="align_left">Item</li></ol>');
		expect(serialize({ type: "headingOne", children: [{ text: "H1" }] })).toBe(
			'<h1 class="align_left">H1</h1>',
		);
		expect(serialize({ type: "headingTwo", children: [{ text: "H2" }] })).toBe(
			'<h2 class="align_left">H2</h2>',
		);
	});

	it("should return an empty string for an unknown element type", () => {
		expect(serialize({ type: "unknownType", children: [{ text: "x" }] })).toBe(
			"",
		);
	});
});

describe("deserialize", () => {
	it("should convert a plain string node into a text node", () => {
		const stringNode = "plain text" as unknown as ParseElement;
		expect(deserialize(stringNode)).toEqual({ text: "plain text" });
	});

	it("should convert a <strong> element into a bold text node", () => {
		const el: ParseElement = { type: "strong", props: { children: "Hi" } };
		expect(deserialize(el)).toEqual({ text: "Hi", bold: true });
	});

	it("should convert <em>, <u> and <code> elements into their respective marks", () => {
		expect(deserialize({ type: "em", props: { children: "a" } })).toEqual({
			text: "a",
			italic: true,
		});
		expect(deserialize({ type: "u", props: { children: "b" } })).toEqual({
			text: "b",
			underline: true,
		});
		expect(deserialize({ type: "code", props: { children: "c" } })).toEqual({
			text: "c",
			code: true,
		});
	});

	it("should convert a <p> element with an align class into a paragraph", () => {
		const el: ParseElement = {
			type: "p",
			props: { children: "Hello", className: "align_center" },
		};

		expect(deserialize(el)).toEqual({
			type: "paragraph",
			align: "center",
			children: [{ text: "Hello" }],
		});
	});

	it("should recurse into an array of children", () => {
		const el = {
			type: "p",
			props: {
				children: ["Hello ", { type: "strong", props: { children: "world" } }],
			},
		} as unknown as ParseElement;

		expect(deserialize(el)).toEqual({
			type: "paragraph",
			align: undefined,
			children: [{ text: "Hello " }, { text: "world", bold: true }],
		});
	});

	it("should convert an <img> element into an image node", () => {
		const el: ParseElement = {
			type: "img",
			props: {
				src: "https://x.com/a.png",
				children: "",
				className: "align_right",
			},
		};

		expect(deserialize(el)).toEqual({
			type: "image",
			align: "right",
			src: "https://x.com/a.png",
			children: [{ text: "" }],
		});
	});

	it("should convert blockquote, list and heading elements", () => {
		expect(
			deserialize({ type: "blockquote", props: { children: "Q" } }),
		).toEqual({
			type: "blockQuote",
			align: undefined,
			children: [{ text: "Q" }],
		});
		expect(deserialize({ type: "h1", props: { children: "Title" } })).toEqual({
			type: "headingOne",
			align: undefined,
			children: [{ text: "Title" }],
		});
		expect(
			deserialize({ type: "h2", props: { children: "Subtitle" } }),
		).toEqual({
			type: "headingTwo",
			align: undefined,
			children: [{ text: "Subtitle" }],
		});
	});

	it("should fall back to a plain text node for an unknown element type", () => {
		expect(deserialize({ type: "span", props: { children: "raw" } })).toEqual({
			text: "raw",
		});
	});

	it("should fall back to an empty text node when children are missing", () => {
		expect(
			deserialize({ type: "span", props: { children: undefined as never } }),
		).toEqual({ text: "" });
	});
});

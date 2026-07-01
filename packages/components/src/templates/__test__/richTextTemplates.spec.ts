import { describe, expect, it } from "vitest";
import {
	hotKeys,
	initialValue,
	listTypes,
	textAlignTypes,
} from "../richTextTemplates";

describe("hotKeys", () => {
	it("should map the expected key combinations to mark formats", () => {
		expect(hotKeys).toEqual({
			"mod+b": "bold",
			"mod+i": "italic",
			"mod+u": "underline",
			"mod+`": "code",
		});
	});

	it("should only contain valid mark format values", () => {
		const validMarks = ["bold", "italic", "underline", "code"];

		Object.values(hotKeys).forEach((mark) => {
			expect(validMarks).toContain(mark);
		});
	});
});

describe("initialValue", () => {
	it("should be a single empty paragraph", () => {
		expect(initialValue).toEqual([
			{ type: "paragraph", children: [{ text: "" }] },
		]);
	});

	it("should be a valid Slate Descendant array shape", () => {
		expect(Array.isArray(initialValue)).toBe(true);
		expect(initialValue).toHaveLength(1);
	});
});

describe("listTypes", () => {
	it("should contain the list-related element types", () => {
		expect(listTypes).toEqual(["listItem", "numberedList"]);
	});
});

describe("textAlignTypes", () => {
	it("should contain the four alignment values", () => {
		expect(textAlignTypes).toEqual(["left", "center", "right", "justify"]);
	});

	it("should not contain duplicate entries", () => {
		expect(new Set(textAlignTypes).size).toBe(textAlignTypes.length);
	});
});

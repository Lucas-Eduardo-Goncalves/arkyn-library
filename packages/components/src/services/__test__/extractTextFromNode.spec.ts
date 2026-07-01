import type { Descendant } from "slate";
import { describe, expect, it } from "vitest";
import { extractTextFromNode } from "../extractTextFromNode";

describe("extractTextFromNode", () => {
	it("should extract text from a single paragraph node", () => {
		const nodes = [
			{ type: "paragraph", children: [{ text: "Hello world" }] },
		] as Descendant[];

		expect(extractTextFromNode(nodes)).toBe("Hello world");
	});

	it("should concatenate text across multiple top-level nodes", () => {
		const nodes = [
			{ type: "paragraph", children: [{ text: "First" }] },
			{ type: "paragraph", children: [{ text: "Second" }] },
		] as Descendant[];

		expect(extractTextFromNode(nodes)).toBe("FirstSecond");
	});

	it("should extract text from deeply nested elements", () => {
		const nodes = [
			{
				type: "bulletedList",
				children: [
					{ type: "listItem", children: [{ text: "One" }] },
					{ type: "listItem", children: [{ text: "Two" }] },
				],
			},
		] as Descendant[];

		expect(extractTextFromNode(nodes)).toBe("OneTwo");
	});

	it("should ignore marks and only return the raw text", () => {
		const nodes = [
			{
				type: "paragraph",
				children: [{ text: "bold text", bold: true, italic: true }],
			},
		] as Descendant[];

		expect(extractTextFromNode(nodes)).toBe("bold text");
	});

	it("should return an empty string for an empty node array", () => {
		expect(extractTextFromNode([])).toBe("");
	});

	it("should return an empty string when the node text is empty", () => {
		const nodes = [
			{ type: "paragraph", children: [{ text: "" }] },
		] as Descendant[];

		expect(extractTextFromNode(nodes)).toBe("");
	});

	it("should not mutate the input nodes", () => {
		const nodes = [
			{ type: "paragraph", children: [{ text: "Immutable" }] },
		] as Descendant[];
		const snapshot = JSON.parse(JSON.stringify(nodes));

		extractTextFromNode(nodes);

		expect(nodes).toEqual(snapshot);
	});

	it("should produce the same result for the same input", () => {
		const nodes = [
			{ type: "paragraph", children: [{ text: "Deterministic" }] },
		] as Descendant[];

		expect(extractTextFromNode(nodes)).toBe(extractTextFromNode(nodes));
	});
});

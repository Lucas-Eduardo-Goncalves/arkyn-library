import type { Descendant } from "slate";
import { createEditor, Transforms } from "slate";
import { describe, expect, it } from "vitest";
import { isBlockActive } from "../isBlockActive";

function makeEditor(children: Descendant[]) {
	const editor = createEditor();
	editor.children = children;
	return editor;
}

describe("isBlockActive", () => {
	it("should return false when the editor has no selection", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "Hello" }] },
		]);

		expect(isBlockActive(editor, "paragraph")).toBe(false);
	});

	it("should return true when the selected block matches the format", () => {
		const editor = makeEditor([
			{ type: "headingOne", children: [{ text: "Title" }] },
		]);
		Transforms.select(editor, { path: [0, 0], offset: 1 });

		expect(isBlockActive(editor, "headingOne")).toBe(true);
	});

	it("should return false when the selected block does not match the format", () => {
		const editor = makeEditor([
			{ type: "headingOne", children: [{ text: "Title" }] },
		]);
		Transforms.select(editor, { path: [0, 0], offset: 1 });

		expect(isBlockActive(editor, "paragraph")).toBe(false);
	});

	it("should track the block matching the current selection across multiple blocks", () => {
		const editor = makeEditor([
			{ type: "headingOne", children: [{ text: "Title" }] },
			{ type: "paragraph", children: [{ text: "Body" }] },
		]);

		Transforms.select(editor, { path: [0, 0], offset: 1 });
		expect(isBlockActive(editor, "headingOne")).toBe(true);
		expect(isBlockActive(editor, "paragraph")).toBe(false);

		Transforms.select(editor, { path: [1, 0], offset: 1 });
		expect(isBlockActive(editor, "headingOne")).toBe(false);
		expect(isBlockActive(editor, "paragraph")).toBe(true);
	});

	it("should check the align property when blockType is 'align'", () => {
		const editor = makeEditor([
			{ type: "paragraph", align: "center", children: [{ text: "Hi" }] },
		]);
		Transforms.select(editor, { path: [0, 0], offset: 1 });

		expect(isBlockActive(editor, "center", "align")).toBe(true);
		expect(isBlockActive(editor, "left", "align")).toBe(false);
	});

	it("should not confuse the 'type' blockType with the 'align' blockType", () => {
		const editor = makeEditor([
			{ type: "paragraph", align: "center", children: [{ text: "Hi" }] },
		]);
		Transforms.select(editor, { path: [0, 0], offset: 1 });

		expect(isBlockActive(editor, "center", "type")).toBe(false);
	});
});

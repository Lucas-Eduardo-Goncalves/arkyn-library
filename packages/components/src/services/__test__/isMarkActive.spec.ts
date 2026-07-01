import type { Descendant } from "slate";
import { createEditor, Editor, Transforms } from "slate";
import { describe, expect, it } from "vitest";
import { isMarkActive } from "../isMarkActive";

function makeEditor(children: Descendant[]) {
	const editor = createEditor();
	editor.children = children;
	return editor;
}

describe("isMarkActive", () => {
	it("should return false when the editor has no selection", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "Hello" }] },
		]);

		expect(isMarkActive(editor, "bold")).toBe(false);
	});

	it("should return false when the mark is not active", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "Hello" }] },
		]);
		Transforms.select(editor, { path: [0, 0], offset: 1 });

		expect(isMarkActive(editor, "bold")).toBe(false);
	});

	it("should return true when the mark is active at the current selection", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "Hello", bold: true }] },
		]);
		Transforms.select(editor, { path: [0, 0], offset: 1 });

		expect(isMarkActive(editor, "bold")).toBe(true);
	});

	it("should distinguish between different mark formats", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "Hello", italic: true }] },
		]);
		Transforms.select(editor, { path: [0, 0], offset: 1 });

		expect(isMarkActive(editor, "italic")).toBe(true);
		expect(isMarkActive(editor, "bold")).toBe(false);
	});

	it("should reflect marks added via Editor.addMark on a range selection", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "Hello world" }] },
		]);
		Transforms.select(editor, {
			anchor: { path: [0, 0], offset: 0 },
			focus: { path: [0, 0], offset: 5 },
		});

		expect(isMarkActive(editor, "underline")).toBe(false);

		Editor.addMark(editor, "underline", true);

		expect(isMarkActive(editor, "underline")).toBe(true);
	});

	it("should return false after the mark has been removed", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "Hello", code: true }] },
		]);
		Transforms.select(editor, { path: [0, 0], offset: 1 });

		Editor.removeMark(editor, "code");

		expect(isMarkActive(editor, "code")).toBe(false);
	});
});

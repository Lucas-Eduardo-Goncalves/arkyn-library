import { createEditor, type Descendant, Transforms } from "slate";
import { describe, expect, it } from "vitest";
import { isMarkActive } from "../isMarkActive";
import { toggleMark } from "../toggleMark";

function makeEditor(children: Descendant[]) {
	const editor = createEditor();
	editor.children = children;
	return editor;
}

describe("toggleMark", () => {
	it("should add the mark when it is not active", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "Hello world" }] },
		]);
		Transforms.select(editor, {
			anchor: { path: [0, 0], offset: 0 },
			focus: { path: [0, 0], offset: 5 },
		});

		toggleMark(editor, "bold");

		expect(isMarkActive(editor, "bold")).toBe(true);
	});

	it("should remove the mark when it is already active", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "Hello world", bold: true }] },
		]);
		Transforms.select(editor, {
			anchor: { path: [0, 0], offset: 0 },
			focus: { path: [0, 0], offset: 5 },
		});

		toggleMark(editor, "bold");

		expect(isMarkActive(editor, "bold")).toBe(false);
	});

	it("should not affect unrelated marks", () => {
		const editor = makeEditor([
			{
				type: "paragraph",
				children: [{ text: "Hello world", italic: true }],
			},
		]);
		Transforms.select(editor, {
			anchor: { path: [0, 0], offset: 0 },
			focus: { path: [0, 0], offset: 5 },
		});

		toggleMark(editor, "bold");

		expect(isMarkActive(editor, "bold")).toBe(true);
		expect(isMarkActive(editor, "italic")).toBe(true);
	});

	it("should toggle back to the original state when called twice", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "Hello world" }] },
		]);
		Transforms.select(editor, {
			anchor: { path: [0, 0], offset: 0 },
			focus: { path: [0, 0], offset: 5 },
		});

		toggleMark(editor, "underline");
		toggleMark(editor, "underline");

		expect(isMarkActive(editor, "underline")).toBe(false);
	});
});

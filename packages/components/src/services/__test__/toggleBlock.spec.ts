import { createEditor, type Descendant, Transforms } from "slate";
import { describe, expect, it } from "vitest";
import { isBlockActive } from "../isBlockActive";
import { toggleBlock } from "../toggleBlock";

function makeEditor(children: Descendant[]) {
	const editor = createEditor();
	editor.children = children;
	return editor;
}

describe("toggleBlock", () => {
	it("should turn a paragraph into the given element type", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "Hi" }] },
		]);
		Transforms.select(editor, { path: [0, 0], offset: 1 });

		toggleBlock(editor, "headingOne");

		expect(editor.children).toEqual([
			{ type: "headingOne", children: [{ text: "Hi" }] },
		]);
	});

	it("should turn the block back into a paragraph when toggled again", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "Hi" }] },
		]);
		Transforms.select(editor, { path: [0, 0], offset: 1 });

		toggleBlock(editor, "headingOne");
		toggleBlock(editor, "headingOne");

		expect(editor.children).toEqual([
			{ type: "paragraph", children: [{ text: "Hi" }] },
		]);
	});

	it("should set the align property instead of the type for alignment formats", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "Hi" }] },
		]);
		Transforms.select(editor, { path: [0, 0], offset: 1 });

		toggleBlock(editor, "center");

		expect(editor.children).toEqual([
			{ type: "paragraph", align: "center", children: [{ text: "Hi" }] },
		]);
	});

	it("should remove the align property when the same alignment is toggled again", () => {
		const editor = makeEditor([
			{ type: "paragraph", align: "center", children: [{ text: "Hi" }] },
		]);
		Transforms.select(editor, { path: [0, 0], offset: 1 });

		toggleBlock(editor, "center");

		expect(editor.children).toEqual([
			{ type: "paragraph", children: [{ text: "Hi" }] },
		]);
		expect(editor.children[0]).not.toHaveProperty("align");
	});

	it("should reflect as active via isBlockActive after toggling on", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "Hi" }] },
		]);
		Transforms.select(editor, { path: [0, 0], offset: 1 });

		toggleBlock(editor, "blockQuote");

		expect(isBlockActive(editor, "blockQuote")).toBe(true);
	});

	it("should switch directly from one element type to another", () => {
		const editor = makeEditor([
			{ type: "headingOne", children: [{ text: "Hi" }] },
		]);
		Transforms.select(editor, { path: [0, 0], offset: 1 });

		toggleBlock(editor, "headingTwo");

		expect(editor.children).toEqual([
			{ type: "headingTwo", children: [{ text: "Hi" }] },
		]);
	});
});

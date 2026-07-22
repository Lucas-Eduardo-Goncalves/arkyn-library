import { createEditor, type Descendant, Editor, Transforms } from "slate";
import { describe, expect, it } from "vitest";
import { clearLinkMarkAtBoundary } from "../clearLinkMarkAtBoundary";

function makeEditor(children: Descendant[]) {
	const editor = createEditor();
	editor.children = children;
	return editor;
}

function selectAt(editor: Editor, offset: number, focusOffset = offset) {
	Transforms.select(editor, {
		anchor: { path: [0, 0], offset },
		focus: { path: [0, 0], offset: focusOffset },
	});
}

describe("clearLinkMarkAtBoundary", () => {
	it("should remove the link and href marks when the cursor is at the end of a link", () => {
		const editor = makeEditor([
			{
				type: "paragraph",
				children: [{ text: "Arkyn", link: true, href: "https://arkyn.dev" }],
			},
		]);
		selectAt(editor, 5);

		clearLinkMarkAtBoundary(editor);

		const marks = Editor.marks(editor);
		expect(marks?.link).toBeUndefined();
		expect(marks?.href).toBeUndefined();
	});

	it("should not remove marks when the cursor is in the middle of a link", () => {
		const editor = makeEditor([
			{
				type: "paragraph",
				children: [{ text: "Arkyn", link: true, href: "https://arkyn.dev" }],
			},
		]);
		selectAt(editor, 2);

		clearLinkMarkAtBoundary(editor);

		expect(Editor.marks(editor)?.link).toBe(true);
	});

	it("should do nothing when the cursor is on plain (non-link) text", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "Hello" }] },
		]);
		selectAt(editor, 5);

		expect(() => clearLinkMarkAtBoundary(editor)).not.toThrow();
		expect(Editor.marks(editor)?.link).toBeUndefined();
	});

	it("should do nothing when the selection is expanded (not collapsed)", () => {
		const editor = makeEditor([
			{
				type: "paragraph",
				children: [{ text: "Arkyn", link: true, href: "https://arkyn.dev" }],
			},
		]);
		selectAt(editor, 0, 5);

		clearLinkMarkAtBoundary(editor);

		expect(Editor.marks(editor)?.link).toBe(true);
	});

	it("should do nothing when there is no selection", () => {
		const editor = makeEditor([
			{
				type: "paragraph",
				children: [{ text: "Arkyn", link: true, href: "https://arkyn.dev" }],
			},
		]);

		expect(() => clearLinkMarkAtBoundary(editor)).not.toThrow();
	});

	it("should preserve other marks when clearing the link mark", () => {
		const editor = makeEditor([
			{
				type: "paragraph",
				children: [
					{
						text: "Arkyn",
						bold: true,
						link: true,
						href: "https://arkyn.dev",
					},
				],
			},
		]);
		selectAt(editor, 5);

		clearLinkMarkAtBoundary(editor);

		const marks = Editor.marks(editor);
		expect(marks?.link).toBeUndefined();
		expect(marks?.bold).toBe(true);
	});
});

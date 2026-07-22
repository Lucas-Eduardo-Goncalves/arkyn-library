import { Editor, Range } from "slate";

function clearLinkMarkAtBoundary(editor: Editor) {
	const { selection } = editor;
	if (!selection || !Range.isCollapsed(selection)) return;

	const [node, path] = Editor.leaf(editor, selection.anchor);
	if (!node.link) return;
	if (!Editor.isEnd(editor, selection.anchor, path)) return;

	Editor.removeMark(editor, "link");
	Editor.removeMark(editor, "href");
}

export { clearLinkMarkAtBoundary };

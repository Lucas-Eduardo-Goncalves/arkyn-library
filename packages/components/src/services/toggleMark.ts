import { Editor } from "slate";

import type { RichTextMarkFormatType } from "../types/richTextTypes";
import { isMarkActive } from "./isMarkActive";

function toggleMark(editor: Editor, format: RichTextMarkFormatType) {
	const isActive = isMarkActive(editor, format);

	if (isActive) Editor.removeMark(editor, format);
	else Editor.addMark(editor, format, true);
}

export { toggleMark };

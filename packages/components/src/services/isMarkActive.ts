import { Editor } from "slate";

import { RichTextMarkFormatType } from "../types/richTextTypes";

function isMarkActive(editor: Editor, format: RichTextMarkFormatType) {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

export { isMarkActive };

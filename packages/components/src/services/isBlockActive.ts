import { Editor, Element as SlateElement } from "slate";

import {
  RichTextAlignFormatType,
  RichTextElementFormatType,
} from "../types/richTextTypes";

function isBlockActive(
  editor: Editor,
  format: RichTextElementFormatType | RichTextAlignFormatType,
  blockType: "type" | "align" = "type"
) {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  );

  return !!match;
}

export { isBlockActive };

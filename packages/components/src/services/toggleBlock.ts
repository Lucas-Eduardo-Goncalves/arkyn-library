import { Editor, Element as SlateElement, Transforms } from "slate";

import { listTypes, textAlignTypes } from "../templates/richTextTemplates";
import {
  RichTextAlignFormatType,
  RichTextElementFormatType,
} from "../types/richTextTypes";
import { isBlockActive } from "./isBlockActive";

function toggleBlock(
  editor: Editor,
  format: RichTextElementFormatType | RichTextAlignFormatType
) {
  const blockType = textAlignTypes.includes(format) ? "align" : "type";
  const isActive = isBlockActive(editor, format, blockType);

  const isList = listTypes.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      listTypes.includes(n.type) &&
      !textAlignTypes.includes(format),
    split: true,
  });

  let newProperties: Partial<SlateElement>;

  if (textAlignTypes.includes(format)) {
    const formatType = format as RichTextAlignFormatType;
    newProperties = { align: isActive ? undefined : formatType };
  } else {
    const formatType = format as RichTextElementFormatType;
    newProperties = {
      type: isActive ? "paragraph" : isList ? "listItem" : formatType,
    };
  }

  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format as RichTextElementFormatType, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

export { toggleBlock };

import { Descendant, RichTextMarkFormatType } from "../types/richTextTypes";

type HotKeys = {
  [key: string]: RichTextMarkFormatType;
};

const hotKeys: HotKeys = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const initialValue: Descendant[] = [
  { type: "paragraph", children: [{ text: "" }] },
];

const listTypes = ["listItem", "numberedList"];

const textAlignTypes = ["left", "center", "right", "justify"];

export { hotKeys, initialValue, listTypes, textAlignTypes };

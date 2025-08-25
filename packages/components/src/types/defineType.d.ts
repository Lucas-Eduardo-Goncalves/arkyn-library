import { BaseEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

import { RichTextCustomElement, RichTextCustomText } from "./richTextTypes";

type RichTextCustomElement = {
  type: RichTextElementFormatType;
  align?: RichTextAlignFormatType;
  src?: string;
  children?: RichTextValue;
};

type RichTextCustomText = {
  bold?: boolean;
  text: string;
  italic?: boolean;
  code?: boolean;
  underline?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: RichTextCustomElement;
    Text: RichTextCustomText;
  }
}

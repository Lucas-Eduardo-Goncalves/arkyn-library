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

type Fbq = {
  (...args: any[]): void;
  callMethod?: (...args: any[]) => void;
  queue: any[];
  push: (...args: any[]) => void;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: RichTextCustomElement;
    Text: RichTextCustomText;
  }
}

export { Fbq };

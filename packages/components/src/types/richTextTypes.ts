type RichTextHiddenButtonKey =
  | "headingOne"
  | "headingTwo"
  | "blockQuote"
  | "bold"
  | "italic"
  | "underline"
  | "code"
  | "left"
  | "right"
  | "center"
  | "justify"
  | "image";

type RichTextElementFormatType =
  | "blockQuote"
  | "bulletedList"
  | "headingOne"
  | "headingTwo"
  | "listItem"
  | "numberedList"
  | "paragraph"
  | "image";

type RichTextAlignFormatType = "center" | "left" | "right" | "justify";

type RichTextMarkFormatType = "bold" | "italic" | "underline" | "code";

type RichTextInsertImageProps = {
  action: string;
  tabLabels?: [string, string];
  modalTitle?: string;
  modalInputUrlLabel?: string;
  modalInputImageLabel?: string;
  modalCancelButton?: string;
  modalConfirmButton?: string;
};

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

type Descendant = RichTextCustomElement | RichTextCustomText;

type RichTextProps = {
  name: string;
  hiddenButtons?: RichTextHiddenButtonKey[];
  maxLimit?: number;
  enforceCharacterLimit?: boolean;
  baseErrorMessage?: string;
  defaultValue?: string;
  isError?: boolean;
  id?: string;
  label?: string;
  showAsterisk?: boolean;
  imageConfig?: RichTextInsertImageProps;
  onChangeCharactersCount?: (e: number) => void;
  onChange?: (value: Descendant[]) => void;
};

type RichTextValue = Descendant[];

type ParseElement = {
  type: string;
  props: {
    src?: string;
    children: ParseElement[] | string;
    className?: string;
  };
};

export type {
  Descendant,
  ParseElement,
  RichTextAlignFormatType,
  RichTextCustomElement,
  RichTextCustomText,
  RichTextElementFormatType,
  RichTextHiddenButtonKey,
  RichTextInsertImageProps,
  RichTextMarkFormatType,
  RichTextProps,
  RichTextValue,
};

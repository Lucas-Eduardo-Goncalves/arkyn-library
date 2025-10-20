import isHotkey from "is-hotkey";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Italic,
  Quote,
  Underline,
} from "lucide-react";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import { createEditor, Descendant, Transforms } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";

import { BlockButton } from "./blockButton";
import { Element } from "./element";
import { InsertImage } from "./insertImage";
import { Leaf } from "./leaf";
import { MarkButton } from "./markButton";
import { Toolbar } from "./toolbar";

import { useForm } from "../../hooks/useForm";
import { extractTextFromNode } from "../../services/extractTextFromNode";
import { toggleMark } from "../../services/toggleMark";
import { hotKeys, initialValue } from "../../templates/richTextTemplates";
import {
  RichTextHiddenButtonKey,
  RichTextProps,
} from "../../types/richTextTypes";

import { FieldError } from "../fieldError";
import { FieldLabel } from "../fieldLabel";
import { FieldWrapper } from "../fieldWrapper";

import "./styles.css";

/**
 * RichText component provides a feature-rich text editor with formatting capabilities
 * including bold, italic, underline, code, headings, block quotes, alignment, and image insertion.
 *
 * Built on top of Slate.js, this component offers a customizable toolbar and supports
 * character limits, form integration, and error handling.
 *
 * @param props - Configuration object for the RichText component
 * @param props.name - The name attribute for the form field (required)
 * @param props.hiddenButtons - Array of button keys to hide from the toolbar
 * @param props.imageConfig - Configuration object for image insertion functionality
 * @param props.defaultValue - Initial JSON string value for the editor content (default: "[]")
 * @param props.enforceCharacterLimit - Whether to enforce the character limit strictly (default: false)
 * @param props.onChangeCharactersCount - Callback function triggered when character count changes
 * @param props.baseErrorMessage - Custom error message to display
 * @param props.maxLimit - Maximum number of characters allowed (default: 2000)
 * @param props.onChange - Callback function triggered when editor content changes
 * @param props.isError - Whether the component should display in error state
 * @param props.id - Custom ID for the editor element
 *
 * @returns JSX element representing the rich text editor
 *
 * @example
 * ```tsx
 * // Basic usage
 * <RichText name="content" />
 *
 * // With character limit and custom buttons
 * <RichText
 *   name="description"
 *   maxLimit={500}
 *   enforceCharacterLimit={true}
 *   hiddenButtons={["image", "code"]}
 *   onChangeCharactersCount={(count) => console.log(count)}
 * />
 *
 * // With image upload configuration
 * <RichText
 *   name="article"
 *   imageConfig={{
 *     action: "/api/upload",
 *     modalTitle: "Insert Image",
 *     modalInputUrlLabel: "Image URL",
 *     modalInputImageLabel: "Upload Image"
 *   }}
 * />
 * ```
 *
 * @description
 * The component includes:
 * - **Formatting**: Bold, italic, underline, code, headings (H1, H2), block quotes
 * - **Alignment**: Left, center, right, justify
 * - **Image Support**: Upload and URL insertion (when imageConfig is provided)
 * - **Character Limits**: Configurable limits with visual feedback
 * - **Form Integration**: Works with form providers and validation
 * - **Keyboard Shortcuts**: Standard shortcuts for formatting (Ctrl+B, Ctrl+I, etc.)
 * - **Error Handling**: Visual error states and validation messages
 *
 * The editor outputs JSON data representing the document structure, which can be
 * converted to HTML using the provided utility functions.
 */

function RichText(props: RichTextProps) {
  const {
    name,
    hiddenButtons,
    imageConfig,
    defaultValue = "[]",
    enforceCharacterLimit = false,
    onChangeCharactersCount,
    baseErrorMessage,
    maxLimit = 10,
    onChange,
    isError: baseIsError,
    label,
    showAsterisk,
    id,
  } = props;

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const { fieldErrors } = useForm();

  function getDefaultNodes(): Descendant[] {
    try {
      const parsedNodes = JSON.parse(defaultValue);
      if (!Array.isArray(parsedNodes)) return initialValue;
      if (parsedNodes.length <= 0) return initialValue;

      const isValidNodes = parsedNodes.every(
        (node) =>
          typeof node === "object" &&
          node !== null &&
          "type" in node &&
          "children" in node
      );

      return isValidNodes ? parsedNodes : initialValue;
    } catch (error) {
      return initialValue;
    }
  }

  const textFromNodes = extractTextFromNode(getDefaultNodes());

  const [charactersCount, setCharactersCount] = useState(textFromNodes.length);
  const [inputValue, setInputValue] = useState(
    JSON.stringify(getDefaultNodes()) || "[]"
  );

  const [onFocus, setOnFocus] = useState(false);

  const ref = useRef<HTMLInputElement>(null);
  const inputId = id || useId();

  const errorMessage = baseErrorMessage || fieldErrors?.[name];
  const isError = baseIsError || !!errorMessage;

  const renderLeaf = useCallback(Leaf, []);
  const renderElement = useCallback(Element, []);

  function handleChange(value: Descendant[]) {
    const text = extractTextFromNode(value);

    setCharactersCount(text.length);
    onChangeCharactersCount && onChangeCharactersCount(text.length);

    if (enforceCharacterLimit && text.length >= maxLimit) {
      return;
    } else {
      setInputValue(JSON.stringify(value));
      onChange && onChange(value);

      editor.children = value;
      Transforms.setNodes(editor, { children: value });
    }
  }

  const focusClass = onFocus ? "focusTrue" : "focusFalse";
  const errorClass = isError
    ? "errorTrue"
    : maxLimit < charactersCount
    ? "errorTrue"
    : "errorFalse";

  const className = `arkynRichText ${errorClass} ${focusClass}`;

  const restatesCharacters = maxLimit - charactersCount;

  function buttonIsNotHidden(format: RichTextHiddenButtonKey) {
    return !hiddenButtons?.includes(format);
  }

  return (
    <FieldWrapper>
      {label && (
        <FieldLabel
          showAsterisk={showAsterisk}
        >
          {label}
        </FieldLabel>
      )}

      <Slate
        editor={editor}
        initialValue={getDefaultNodes()}
        onChange={handleChange}
        onValueChange={handleChange}
      >
        <div className={className}>
          <Toolbar>
            {buttonIsNotHidden("headingOne") && (
              <BlockButton format="headingOne" icon={Heading1} />
            )}

            {buttonIsNotHidden("headingTwo") && (
              <BlockButton format="headingTwo" icon={Heading2} />
            )}

            {buttonIsNotHidden("blockQuote") && (
              <BlockButton format="blockQuote" icon={Quote} />
            )}

            {buttonIsNotHidden("bold") && (
              <MarkButton format="bold" icon={Bold} />
            )}

            {buttonIsNotHidden("italic") && (
              <MarkButton format="italic" icon={Italic} />
            )}

            {buttonIsNotHidden("underline") && (
              <MarkButton format="underline" icon={Underline} />
            )}

            {buttonIsNotHidden("code") && (
              <MarkButton format="code" icon={Code} />
            )}

            {buttonIsNotHidden("left") && (
              <BlockButton format="left" icon={AlignLeft} />
            )}

            {buttonIsNotHidden("right") && (
              <BlockButton format="right" icon={AlignRight} />
            )}

            {buttonIsNotHidden("center") && (
              <BlockButton format="center" icon={AlignCenter} />
            )}

            {buttonIsNotHidden("justify") && (
              <BlockButton format="justify" icon={AlignJustify} />
            )}

            {imageConfig && buttonIsNotHidden("image") && (
              <InsertImage {...imageConfig} />
            )}
          </Toolbar>

          <Editable
            className="editorContainer"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            spellCheck
            ref={ref}
            id={inputId}
            onFocus={() => setOnFocus(true)}
            onBlur={() => setOnFocus(false)}
            onKeyDown={(event) => {
              for (const hotkey in hotKeys) {
                if (isHotkey(hotkey, event as any)) {
                  event.preventDefault();
                  const mark = hotKeys[hotkey as keyof typeof hotKeys];
                  toggleMark(editor, mark);
                }
              }
            }}
          />

          {restatesCharacters < 0 && (
            <div className="restatesCharacters">{restatesCharacters}</div>
          )}
        </div>

        <input
          type="hidden"
          name={name}
          value={inputValue.slice(0, maxLimit)}
        />

        <input type="hidden" name={`${name}Count`} value={charactersCount} />
      </Slate>
      <FieldError>{errorMessage}</FieldError>
    </FieldWrapper>
  );
}

export { RichText };

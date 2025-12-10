import {
  FocusEvent,
  TextareaHTMLAttributes,
  useId,
  useRef,
  useState,
} from "react";

import { useForm } from "../../hooks/useForm";
import { FieldLabel } from "../fieldLabel";
import { FieldWrapper } from "../fieldWrapper";

import { FieldError } from "../fieldError";
import "./styles.css";

type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "name" | "value" | "defaultValue"
> & {
  name: string;

  label?: string;
  showAsterisk?: boolean;
  errorMessage?: string;

  size?: "md" | "lg";
  variant?: "solid" | "outline";

  value?: string | null;
  defaultValue?: string | null;
};

/**
 * Textarea component - used for multi-line text input with customizable styling and validation
 *
 * @param props - Textarea component properties
 * @param props.name - Required field name for form handling and textarea identification
 * @param props.label - Optional label text to display above the textarea
 * @param props.showAsterisk - Whether to show asterisk on label for required fields
 * @param props.errorMessage - Error message to display below the textarea
 * @param props.size - Size variant of the textarea. Default: "md"
 * @param props.variant - Visual variant of the textarea. Default: "solid"
 *
 * **...Other valid HTML properties for textarea element (except name)**
 *
 * @returns Textarea JSX element wrapped in FieldWrapper with optional label and error message
 *
 * @example
 * ```tsx
 * // Basic textarea
 * <Textarea name="description" placeholder="Enter description..." />
 *
 * // Textarea with label and validation
 * <Textarea
 *   name="bio"
 *   label="Biography"
 *   showAsterisk
 *   placeholder="Tell us about yourself"
 *   errorMessage="Biography is required"
 * />
 *
 * // Large textarea with outline variant
 * <Textarea
 *   name="comments"
 *   label="Comments"
 *   size="lg"
 *   variant="outline"
 *   placeholder="Enter your comments here..."
 *   rows={6}
 * />
 *
 * // Textarea with character limit and custom styling
 * <Textarea
 *   name="feedback"
 *   label="Feedback"
 *   placeholder="Share your feedback (max 500 characters)"
 *   maxLength={500}
 *   rows={4}
 *   className="feedback-textarea"
 * />
 *
 * // Read-only textarea for display
 * <Textarea
 *   name="terms"
 *   label="Terms and Conditions"
 *   value={termsContent}
 *   readOnly
 *   rows={10}
 *   variant="outline"
 * />
 *
 * // Disabled textarea
 * <Textarea
 *   name="disabled_field"
 *   label="Disabled Field"
 *   value="This field is disabled"
 *   disabled
 *   placeholder="Cannot edit this field"
 * />
 *
 * // Textarea with controlled value and change handler
 * <Textarea
 *   name="message"
 *   label="Message"
 *   value={message}
 *   onChange={(e) => setMessage(e.target.value)}
 *   placeholder="Type your message..."
 *   rows={5}
 *   showAsterisk
 * />
 *
 * // Textarea with resize control
 * <Textarea
 *   name="notes"
 *   label="Notes"
 *   placeholder="Enter your notes..."
 *   style={{ resize: 'vertical' }}
 *   rows={3}
 *   cols={50}
 * />
 * ```
 */

function Textarea(props: TextareaProps) {
  const {
    variant = "solid",
    size = "md",
    className: wrapperClassName,
    errorMessage: baseErrorMessage,
    disabled = false,
    readOnly = false,
    label,
    showAsterisk,
    name,
    onFocus,
    onBlur,
    title,
    style,
    value,
    defaultValue,
    placeholder,
    id,
    ...rest
  } = props;

  const { fieldErrors } = useForm();
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaId = id || useId();

  const errorMessage = baseErrorMessage || fieldErrors?.[name];
  const isError = !!errorMessage;

  const errorClass = isError ? "errorTrue" : "errorFalse";
  const opacityClass = disabled || readOnly ? "opacityTrue" : "opacityFalse";
  const focusedClass = isFocused ? "focusedTrue" : "focusedFalse";

  const className = `arkynTextarea ${variant} ${size} ${opacityClass} ${errorClass} ${focusedClass}`;

  function handleSectionClick() {
    if (disabled || !textareaRef?.current) return;
    setIsFocused(true);
    textareaRef.current.focus();
  }

  function handleFocus(e: FocusEvent<HTMLTextAreaElement>) {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  }

  function handleBlur(e: FocusEvent<HTMLTextAreaElement>) {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  }

  return (
    <FieldWrapper className={wrapperClassName}>
      {label && (
        <FieldLabel htmlFor={textareaId} showAsterisk={showAsterisk}>
          {label}
        </FieldLabel>
      )}

      <section
        title={title}
        style={style}
        onClick={handleSectionClick}
        className={className}
      >
        <textarea
          id={textareaId}
          disabled={disabled}
          readOnly={readOnly}
          ref={textareaRef}
          name={name}
          onFocus={handleFocus}
          onBlur={handleBlur}
          defaultValue={defaultValue || ""}
          placeholder={disabled ? value || placeholder : placeholder}
          value={disabled ? undefined : value}
          {...rest}
        />
      </section>
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </FieldWrapper>
  );
}

export { Textarea };

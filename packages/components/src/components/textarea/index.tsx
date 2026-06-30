import {
	type FocusEvent,
	type TextareaHTMLAttributes,
	useId,
	useRef,
	useState,
} from "react";

import { useForm } from "../../hooks/useForm";
import { FieldError } from "../fieldError";
import { FieldLabel } from "../fieldLabel";
import { FieldWrapper } from "../fieldWrapper";
import "./styles.css";

type TextareaProps = Omit<
	TextareaHTMLAttributes<HTMLTextAreaElement>,
	"name" | "value" | "defaultValue"
> & {
	/** Field name for form submission. Required. */
	name: string;
	/** Optional label text displayed above the textarea. */
	label?: string;
	/** Displays an asterisk on the label to signal a required field. */
	showAsterisk?: boolean;
	/** Validation error message displayed below the textarea. */
	errorMessage?: string;
	/**
	 * Textarea size.
	 * @default "md"
	 */
	size?: "md" | "lg";
	/**
	 * Visual style variant.
	 * - `solid`: filled background.
	 * - `outline`: bordered, transparent background.
	 * @default "solid"
	 */
	variant?: "solid" | "outline";
	/** Controlled value. */
	value?: string;
	/** Uncontrolled default value. */
	defaultValue?: string;
};

/**
 * Textarea — multi-line text input with label, validation, and form integration.
 *
 * Integrates with `useForm` to display validation errors by field name.
 *
 * @param props.name - Field name for form submission. Required.
 * @param props.label - Label text displayed above the textarea.
 * @param props.showAsterisk - Appends `*` to the label.
 * @param props.errorMessage - Validation error message.
 * @param props.size - Textarea size (`md` | `lg`). Default: "md"
 * @param props.variant - Visual style variant. Default: "solid"
 *
 * **...Other valid HTML properties for `<textarea>`**
 *
 * @returns Textarea JSX element wrapped in `FieldWrapper`.
 *
 * @example
 * ```tsx
 * // Basic
 * <Textarea name="description" placeholder="Enter description..." />
 *
 * // With label and validation
 * <Textarea
 *   name="bio"
 *   label="Biography"
 *   showAsterisk
 *   placeholder="Tell us about yourself"
 *   errorMessage="Biography is required"
 * />
 *
 * // Controlled with custom rows
 * <Textarea
 *   name="message"
 *   label="Message"
 *   value={message}
 *   onChange={(e) => setMessage(e.target.value)}
 *   rows={5}
 *   size="lg"
 *   variant="outline"
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
	const generatedId = useId();
	const textareaId = id || generatedId;

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

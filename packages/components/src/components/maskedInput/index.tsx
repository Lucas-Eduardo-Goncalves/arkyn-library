import { InputMask, type Replacement } from "@react-input/mask";
import { Loader2, type LucideIcon } from "lucide-react";
import {
	type FocusEvent,
	forwardRef,
	type InputHTMLAttributes,
	useId,
	useRef,
	useState,
} from "react";

import { useForm } from "../../hooks/useForm";
import { IconRenderer } from "../../services/iconRenderer";

import { FieldError } from "../fieldError";
import { FieldLabel } from "../fieldLabel";
import { FieldWrapper } from "../fieldWrapper";

import "./style.css";

type MaskedInputProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"size" | "prefix" | "name" | "type"
> & {
	/** Field name for form submission. Required. */
	name: string;
	/**
	 * Mask pattern string. Use the replacement character as an editable placeholder.
	 * Example: `"(__) _____-____"` for a Brazilian mobile phone number.
	 * Required.
	 */
	mask: string;
	/**
	 * Character or replacement map that marks editable positions in the mask.
	 * - String: `"_"` — every `_` in the mask becomes editable.
	 * - Object: `{ _: /\d/ }` — only accepts digits in those positions.
	 * Required.
	 */
	replacement: string | Replacement;
	/**
	 * When true, strips mask characters from the underlying value,
	 * keeping only the user-typed characters.
	 */
	separate?: boolean;
	/** When true, shows the full mask pattern in the input before the user types. */
	showMask?: boolean;
	/** Optional label text displayed above the input. */
	label?: string;
	/** Validation error message displayed below the input. */
	errorMessage?: string;
	/** Shows a spinner and disables the input during async operations. @default false */
	isLoading?: boolean;
	/**
	 * Input size.
	 * @default "md"
	 */
	size?: "md" | "lg";
	/**
	 * Visual style variant.
	 * - `solid`: filled background.
	 * - `outline`: bordered, transparent background.
	 * - `underline`: bottom border only.
	 * @default "solid"
	 */
	variant?: "solid" | "outline" | "underline";
	/** Text or icon rendered at the far left, outside the input area. */
	prefix?: string | LucideIcon;
	/** Text or icon rendered at the far right, outside the input area. */
	suffix?: string | LucideIcon;
	/** Displays an asterisk on the label to signal a required field. */
	showAsterisk?: boolean;
	/** Lucide icon rendered inside the input on the left. */
	leftIcon?: LucideIcon;
	/** Lucide icon rendered inside the input on the right. */
	rightIcon?: LucideIcon;
	/** Controlled value. */
	value?: string;
	/** Uncontrolled default value. */
	defaultValue?: string;
};

const BaseInput = forwardRef<
	HTMLInputElement,
	InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
	return <input ref={ref} {...props} />;
});

/**
 * MaskedInput — text input with a configurable mask for structured values (phones, CPF, credit cards, etc.).
 *
 * Built on `@react-input/mask`. Integrates with `useForm` to display validation errors by field name.
 *
 * @param props.name - Field name for form submission. Required.
 * @param props.mask - Mask pattern string. Required.
 * @param props.replacement - Character or map that marks editable positions. Required.
 * @param props.separate - Strips mask chars from the value, keeping only typed characters.
 * @param props.showMask - Shows the full mask pattern before the user types.
 * @param props.label - Label text displayed above the input.
 * @param props.errorMessage - Validation error message.
 * @param props.isLoading - Shows a spinner and disables the input. Default: false
 * @param props.size - Input size (`md` | `lg`). Default: "md"
 * @param props.variant - Visual style variant. Default: "solid"
 * @param props.prefix - Text or icon at the far left.
 * @param props.suffix - Text or icon at the far right.
 * @param props.leftIcon - Lucide icon inside the input on the left.
 * @param props.rightIcon - Lucide icon inside the input on the right.
 * @param props.showAsterisk - Appends `*` to the label.
 *
 * **...Other valid HTML properties for `<input>` (except `type`)**
 *
 * @returns MaskedInput JSX element wrapped in `FieldWrapper`.
 *
 * @example
 * ```tsx
 * // Brazilian mobile phone
 * <MaskedInput
 *   name="phone"
 *   mask="(__) _____-____"
 *   replacement={{ _: /\d/ }}
 *   label="Phone"
 * />
 *
 * // CPF with mask visible and validation
 * <MaskedInput
 *   name="cpf"
 *   label="CPF"
 *   mask="___.___.___-__"
 *   replacement="_"
 *   showMask
 *   showAsterisk
 *   errorMessage="Invalid CPF"
 * />
 *
 * // Credit card
 * <MaskedInput
 *   name="card"
 *   label="Credit Card"
 *   mask="____ ____ ____ ____"
 *   replacement={{ _: /\d/ }}
 *   leftIcon={CreditCard}
 * />
 * ```
 */

function MaskedInput(props: MaskedInputProps) {
	const {
		name,
		disabled,
		title,
		style,
		variant = "solid",
		separate,
		mask,
		showMask,
		replacement,
		label,
		className: wrapperClassName = "",
		prefix,
		suffix,
		isLoading = false,
		leftIcon,
		readOnly,
		onFocus,
		onBlur,
		errorMessage: baseErrorMessage,
		defaultValue,
		showAsterisk,
		rightIcon,
		size = "md",
		id,
		value,
		placeholder,
		...rest
	} = props;

	const { fieldErrors } = useForm();
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const generatedId = useId();
	const inputId = id || generatedId;

	const errorMessage = baseErrorMessage || fieldErrors?.[name];
	const isError = !!errorMessage;
	const isDisabled = disabled || isLoading;

	const iconSizes = { md: 20, lg: 20 };
	const iconSize = iconSizes[size];

	const loadingPosition = rightIcon ? "right" : "left";

	const showLeftSpinner = loadingPosition === "left" && isLoading;
	const showRightSpinner = loadingPosition === "right" && isLoading;

	function handleSectionClick() {
		if (isDisabled || !inputRef?.current) return;
		setIsFocused(true);
		inputRef.current.focus();
	}

	function handleFocus(e: FocusEvent<HTMLInputElement>) {
		setIsFocused(true);
		if (onFocus) onFocus(e);
	}

	function handleBlur(e: FocusEvent<HTMLInputElement>) {
		setIsFocused(false);
		if (onBlur) onBlur(e);
	}

	const hasPrefix = prefix ? "hasPrefix" : "";
	const hasSuffix = suffix ? "hasSuffix" : "";
	const errored = isError ? "errored" : "";
	const opacity = isDisabled || readOnly || isLoading ? "opacity" : "";
	const focused = isFocused ? "focused" : "";

	const className = `arkynMaskedInput ${hasPrefix} ${hasSuffix} ${variant} ${size} ${opacity} ${errored} ${focused}`;

	return (
		<FieldWrapper className={wrapperClassName}>
			{label && (
				<FieldLabel showAsterisk={showAsterisk} htmlFor={inputId}>
					{label}
				</FieldLabel>
			)}

			<section
				title={title}
				style={style}
				onClick={handleSectionClick}
				className={className}
			>
				<IconRenderer iconSize={iconSize} icon={prefix} className="prefix" />

				<IconRenderer
					show={showLeftSpinner}
					iconSize={iconSize}
					className="spinner"
					icon={Loader2}
				/>

				<IconRenderer show={!isLoading} icon={leftIcon} iconSize={iconSize} />

				<InputMask
					component={BaseInput}
					mask={mask}
					replacement={replacement}
					separate={separate}
					showMask={showMask}
					ref={inputRef}
					onFocus={handleFocus}
					onBlur={handleBlur}
					disabled={isDisabled}
					readOnly={readOnly}
					id={inputId}
					name={name}
					defaultValue={defaultValue || undefined}
					placeholder={isDisabled ? value || placeholder : placeholder}
					value={isDisabled ? undefined : value}
					{...rest}
				/>

				<IconRenderer show={!isLoading} icon={rightIcon} iconSize={iconSize} />

				<IconRenderer
					show={showRightSpinner}
					iconSize={iconSize}
					className="spinner"
					icon={Loader2}
				/>

				<IconRenderer iconSize={iconSize} icon={suffix} className="suffix" />
			</section>

			{errorMessage && <FieldError>{errorMessage}</FieldError>}
		</FieldWrapper>
	);
}

export { MaskedInput };

import { Loader2, type LucideIcon } from "lucide-react";
import {
	type FocusEvent,
	type InputHTMLAttributes,
	useId,
	useRef,
	useState,
} from "react";

import { useForm } from "../../hooks/useForm";
import { FieldTemplate } from "../../services/fieldTemplate";
import { IconRenderer } from "../../services/iconRenderer";

import "./style.css";

type InputProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"size" | "prefix" | "name" | "value" | "defaultValue"
> & {
	/** Field name for form submission. Required. */
	name: string;
	/** Optional label text displayed above the input. */
	label?: string;
	/** Validation error message displayed below the input. */
	errorMessage?: string;
	/** Shows a spinner and disables the input during async operations. @default false */
	isLoading?: boolean;
	/** When true, skips `FieldTemplate` wrapper (label and error text). @default false */
	unShowFieldTemplate?: boolean;
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
	/** Text or icon rendered at the far left, outside the input area (e.g. `"https://"`). */
	prefix?: string | LucideIcon;
	/** Text or icon rendered at the far right, outside the input area (e.g. `".com"`). */
	suffix?: string | LucideIcon;
	/** Displays an asterisk on the label to signal a required field. */
	showAsterisk?: boolean;
	/**
	 * Layout direction forwarded to `FieldTemplate`.
	 * @default "horizontal"
	 */
	orientation?: "horizontal" | "vertical" | "horizontalReverse";
	/** Lucide icon rendered inside the input on the left. */
	leftIcon?: LucideIcon;
	/** Lucide icon rendered inside the input on the right. */
	rightIcon?: LucideIcon;
	/** Controlled value. */
	value?: string;
	/** Uncontrolled default value. */
	defaultValue?: string;
};

/**
 * Input — text input field with label, validation, icons, prefix/suffix, and loading state.
 *
 * Integrates with `useForm` to display validation errors by field name.
 *
 * @param props.name - Field name for form submission. Required.
 * @param props.label - Label text displayed above the input.
 * @param props.errorMessage - Validation error message.
 * @param props.isLoading - Shows a spinner and disables the input. Default: false
 * @param props.size - Input size (`md` | `lg`). Default: "md"
 * @param props.variant - Visual style variant. Default: "solid"
 * @param props.prefix - Text or icon at the far left (outside the input).
 * @param props.suffix - Text or icon at the far right (outside the input).
 * @param props.leftIcon - Lucide icon inside the input on the left.
 * @param props.rightIcon - Lucide icon inside the input on the right.
 * @param props.showAsterisk - Appends `*` to the label.
 * @param props.orientation - Layout direction (`horizontal` | `vertical` | `horizontalReverse`). Default: "horizontal"
 * @param props.unShowFieldTemplate - Skips wrapper, label, and error rendering. Default: false
 *
 * **...Other valid HTML properties for `<input>`**
 *
 * @returns Input JSX element wrapped in `FieldTemplate`.
 *
 * @example
 * ```tsx
 * // Basic
 * <Input name="username" placeholder="Enter username" />
 *
 * // With label and validation
 * <Input
 *   name="email"
 *   label="Email Address"
 *   type="email"
 *   showAsterisk
 *   errorMessage="Please enter a valid email"
 * />
 *
 * // With icons and loading state
 * <Input name="search" label="Search" leftIcon={SearchIcon} isLoading />
 *
 * // With prefix/suffix
 * <Input name="website" label="Website" prefix="https://" suffix=".com" variant="outline" />
 * ```
 */

function Input(props: InputProps) {
	const {
		name,
		disabled,
		title,
		style,
		variant = "solid",
		label,
		className: wrapperClassName = "",
		prefix,
		suffix,
		isLoading = false,
		leftIcon,
		readOnly,
		onFocus,
		onBlur,
		unShowFieldTemplate = false,
		errorMessage: baseErrorMessage,
		showAsterisk,
		rightIcon,
		type = "text",
		size = "md",
		id,
		value,
		placeholder,
		orientation,
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

	if (type === "hidden") {
		return (
			<input
				style={{ display: "none" }}
				readOnly
				type="text"
				ref={inputRef}
				{...rest}
			/>
		);
	}

	const hasPrefix = prefix ? "hasPrefix" : "";
	const hasSuffix = suffix ? "hasSuffix" : "";
	const errored = isError ? "errored" : "";
	const opacity = isDisabled || readOnly || isLoading ? "opacity" : "";
	const focused = isFocused ? "focused" : "";
	const disabledClass = disabled ? "disabled" : "";

	const className = `arkynInput ${hasPrefix} ${disabledClass} ${hasSuffix} ${variant} ${size} ${opacity} ${errored} ${focused}`;

	return (
		<FieldTemplate
			name={name}
			label={label}
			showAsterisk={showAsterisk}
			className={wrapperClassName}
			errorMessage={errorMessage}
			unShowFieldTemplate={unShowFieldTemplate}
			orientation={orientation}
		>
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

				<input
					disabled={isDisabled}
					readOnly={readOnly}
					ref={inputRef}
					onFocus={handleFocus}
					onBlur={handleBlur}
					type={type}
					id={inputId}
					name={name}
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
		</FieldTemplate>
	);
}

export { Input, type InputProps };

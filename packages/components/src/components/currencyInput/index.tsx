import { Loader2, type LucideIcon } from "lucide-react";
import {
	type ChangeEvent,
	type FocusEvent,
	type InputHTMLAttributes,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";

import { useForm } from "../../hooks/useForm";
import { FieldTemplate } from "../../services/fieldTemplate";
import { IconRenderer } from "../../services/iconRenderer";
import {
	maskCurrencyValues,
	normalizeValue,
} from "../../services/maskCurrencyValues";

import "./style.css";

type Locale =
	| "USD"
	| "EUR"
	| "JPY"
	| "GBP"
	| "AUD"
	| "CAD"
	| "CHF"
	| "CNY"
	| "SEK"
	| "NZD"
	| "BRL"
	| "INR"
	| "RUB"
	| "ZAR"
	| "MXN"
	| "SGD"
	| "HKD"
	| "NOK"
	| "KRW"
	| "TRY"
	| "IDR"
	| "THB";

type CurrencyInputProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	| "size"
	| "prefix"
	| "name"
	| "type"
	| "max"
	| "defaultValue"
	| "value"
	| "onChange"
	| "placeholder"
> & {
	/** Field name for form submission. Required. */
	name: string;
	/**
	 * Currency locale used to format the displayed value.
	 * Supported: `"USD"` | `"EUR"` | `"BRL"` | `"JPY"` | `"GBP"` | … (22 locales).
	 * Required.
	 */
	locale: Locale;
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
	/**
	 * Layout direction forwarded to `FieldTemplate`.
	 * @default "horizontal"
	 */
	orientation?: "horizontal" | "vertical" | "horizontalReverse";
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
	/** Maximum numeric value allowed. @default 1_000_000_000 */
	max?: number;
	/** Controlled numeric value. */
	value?: number;
	/** Uncontrolled default numeric value. */
	defaultValue?: number;
	/**
	 * Callback fired on value change.
	 * @param event - Native change event.
	 * @param originalValue - Raw numeric string (e.g. `"1234.56"`).
	 * @param maskedValue - Formatted display string (e.g. `"$ 1,234.56"`).
	 */
	onChange?: (
		event: ChangeEvent<HTMLInputElement>,
		originalValue: string,
		maskedValue: string,
	) => void;
};

/**
 * CurrencyInput — numeric input that automatically formats the displayed value according to a currency locale.
 *
 * The raw numeric value is stored in a hidden `<input>` for form submission.
 * Integrates with `useForm` to display validation errors by field name.
 *
 * @param props.name - Field name for form submission. Required.
 * @param props.locale - Currency locale (e.g. `"USD"`, `"BRL"`, `"EUR"`). Required.
 * @param props.label - Label text displayed above the input.
 * @param props.errorMessage - Validation error message.
 * @param props.isLoading - Shows a spinner and disables the input. Default: false
 * @param props.size - Input size (`md` | `lg`). Default: "md"
 * @param props.variant - Visual style variant. Default: "solid"
 * @param props.max - Maximum numeric value allowed. Default: 1_000_000_000
 * @param props.value - Controlled numeric value.
 * @param props.defaultValue - Uncontrolled default numeric value.
 * @param props.onChange - Callback fired on change — receives the event, the raw numeric string, and the formatted string.
 * @param props.prefix - Text or icon at the far left.
 * @param props.suffix - Text or icon at the far right.
 * @param props.leftIcon - Lucide icon inside the input on the left.
 * @param props.rightIcon - Lucide icon inside the input on the right.
 * @param props.showAsterisk - Appends `*` to the label.
 * @param props.orientation - Layout direction. Default: "horizontal"
 * @param props.unShowFieldTemplate - Skips wrapper, label, and error rendering. Default: false
 *
 * **...Other valid HTML properties for `<input>` (except `type`, `max`, `value`, `defaultValue`, `onChange`, `placeholder`)**
 *
 * @returns CurrencyInput JSX element wrapped in `FieldTemplate`.
 *
 * @example
 * ```tsx
 * // Basic
 * <CurrencyInput name="price" locale="USD" />
 *
 * // With label and validation
 * <CurrencyInput
 *   name="salary"
 *   locale="BRL"
 *   label="Monthly Salary"
 *   showAsterisk
 *   errorMessage="Please enter a valid amount"
 * />
 *
 * // With max value and controlled state
 * <CurrencyInput
 *   name="limit"
 *   locale="USD"
 *   label="Credit Limit"
 *   max={10000}
 *   value={creditLimit}
 *   onChange={(e, original) => setCreditLimit(Number(original))}
 * />
 * ```
 */

function CurrencyInput(props: CurrencyInputProps) {
	const {
		name,
		disabled,
		title,
		style,
		variant = "solid",
		label,
		className: wrapperClassName = "",
		value,
		defaultValue,
		max = 1000000000,
		locale,
		onChange,
		prefix,
		suffix,
		isLoading = false,
		leftIcon,
		readOnly,
		onFocus,
		onBlur,
		errorMessage: baseErrorMessage,
		unShowFieldTemplate,
		orientation,
		showAsterisk,
		rightIcon,
		size = "md",
		id,
		...rest
	} = props;

	const { fieldErrors } = useForm();
	const [isFocused, setIsFocused] = useState(false);
	const [maskedValue, setMaskedValue] = useState("0");

	const inputRef = useRef<HTMLInputElement>(null);
	const inputId = id || useId();

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

	const updateValues = (originalValue: string | number) => {
		const [calculatedValue, calculatedMaskedValue] = maskCurrencyValues(
			originalValue,
			locale,
		);

		if (!max || calculatedValue <= max) {
			setMaskedValue(calculatedMaskedValue);
			return [calculatedValue, calculatedMaskedValue];
		}

		return maskCurrencyValues(originalValue, locale);
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const [originalValue, maskedValue] = updateValues(event.target.value);

		onChange?.(event, String(originalValue), String(maskedValue));
	};

	useEffect(() => {
		function currentValue() {
			if (typeof value === "number") return value;
			if (typeof defaultValue === "number") return defaultValue;
			return undefined;
		}

		const [, maskedValue] = maskCurrencyValues(currentValue(), locale);

		setMaskedValue(maskedValue);
	}, [locale, defaultValue, value]);

	const hasPrefix = prefix ? "hasPrefix" : "";
	const hasSuffix = suffix ? "hasSuffix" : "";
	const errored = isError ? "errored" : "";
	const opacity = isDisabled || readOnly || isLoading ? "opacity" : "";
	const focused = isFocused ? "focused" : "";

	const className = `arkynCurrencyInput ${hasPrefix} ${hasSuffix} ${variant} ${size} ${opacity} ${errored} ${focused}`;

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
				className={className}
				onClick={handleSectionClick}
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
					onChange={handleChange}
					id={inputId}
					placeholder={isDisabled ? maskedValue : undefined}
					value={isDisabled ? undefined : maskedValue}
					{...rest}
				/>

				<input
					type="hidden"
					name={name}
					value={normalizeValue(maskedValue)}
					readOnly
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

export { CurrencyInput };

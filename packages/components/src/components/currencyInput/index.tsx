import { Loader2, LucideIcon } from "lucide-react";
import {
  ChangeEvent,
  InputHTMLAttributes,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
} from "react";

import { useForm } from "../../hooks/useForm";
import { IconRenderer } from "../../services/iconRenderer";
import { maskCurrencyValues } from "../../services/maskCurrencyValues";

import { FieldError } from "../fieldError";
import { FieldLabel } from "../fieldLabel";
import { FieldWrapper } from "../fieldWrapper";

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
> & {
  name: string;
  locale: Locale;

  label?: string;
  errorMessage?: string;
  isLoading?: boolean;

  size?: "md" | "lg";
  variant?: "solid" | "outline" | "underline";

  prefix?: string | LucideIcon;
  suffix?: string | LucideIcon;
  showAsterisk?: boolean;

  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;

  max?: number;
  value?: number;
  defaultValue?: number | null;

  onChange?: (
    event: ChangeEvent<HTMLInputElement>,
    originalValue: string,
    maskedValue: string
  ) => void;
};

/**
 * CurrencyInput component - used for currency input fields with automatic formatting based on locale
 *
 * @param props - CurrencyInput component properties
 * @param props.name - Required field name for form handling
 * @param props.locale - Currency locale for formatting (e.g., "USD", "EUR", "BRL", etc.)
 * @param props.label - Optional label text to display above the input
 * @param props.errorMessage - Error message to display below the input
 * @param props.isLoading - Controls loading state with spinner. Default: false
 * @param props.size - Input size. Default: "md"
 * @param props.variant - Visual variant of the input. Default: "solid"
 * @param props.prefix - Text or icon to display at the beginning of the input
 * @param props.suffix - Text or icon to display at the end of the input
 * @param props.showAsterisk - Whether to show asterisk on label for required fields
 * @param props.leftIcon - Optional icon to display on the left side
 * @param props.rightIcon - Optional icon to display on the right side
 * @param props.max - Maximum allowed value for the currency input
 * @param props.value - Controlled value (number) for the input
 * @param props.defaultValue - Default value (number) for uncontrolled usage
 * @param props.onChange - Callback function called when value changes, receives event, original value and masked value
 *
 * **...Other valid HTML properties for input element (except type, max, defaultValue, value, onChange)**
 *
 * @returns CurrencyInput JSX element wrapped in FieldGroup with optional label and error
 *
 * @example
 * ```tsx
 * // Basic currency input
 * <CurrencyInput name="price" locale="USD" placeholder="Enter price" />
 *
 * // Currency input with label and validation
 * <CurrencyInput
 *   name="salary"
 *   locale="BRL"
 *   label="Monthly Salary"
 *   showAsterisk
 *   errorMessage="Please enter a valid amount"
 * />
 *
 * // Currency input with icons and loading state
 * <CurrencyInput
 *   name="budget"
 *   locale="EUR"
 *   label="Budget"
 *   leftIcon={DollarSignIcon}
 *   rightIcon={CalculatorIcon}
 *   isLoading
 * />
 *
 * // Currency input with max value and controlled state
 * <CurrencyInput
 *   name="limit"
 *   locale="USD"
 *   label="Credit Limit"
 *   max={10000}
 *   value={creditLimit}
 *   onChange={(e, original, masked) => setCreditLimit(Number(original))}
 *   variant="outline"
 * />
 *
 * // Large currency input with prefix/suffix
 * <CurrencyInput
 *   name="investment"
 *   locale="GBP"
 *   label="Investment Amount"
 *   size="lg"
 *   variant="underline"
 *   prefix="£"
 *   suffix="GBP"
 *   placeholder="Enter investment amount"
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
    className: baseClassName = "",
    value,
    defaultValue,
    max,
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

  const iconSizes = { md: 20, lg: 20 };
  const iconSize = iconSizes[size];

  const loadingPosition = rightIcon ? "right" : "left";

  const showLeftSpinner = loadingPosition === "left" && isLoading;
  const showRightSpinner = loadingPosition === "right" && isLoading;

  function handleSectionClick() {
    if (disabled || !inputRef?.current) return;
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
      locale
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

    onChange && onChange(event, String(originalValue), String(maskedValue));
  };

  useEffect(() => {
    const currentValue = value || +defaultValue || undefined;
    const [, maskedValue] = maskCurrencyValues(currentValue, locale);

    setMaskedValue(maskedValue);
  }, [locale, defaultValue, value]);

  const hasPrefix = !!prefix ? "hasPrefix" : "";
  const hasSuffix = !!suffix ? "hasSuffix" : "";
  const errored = isError ? "errored" : "";
  const opacity = disabled || readOnly || isLoading ? "opacity" : "";
  const focused = isFocused ? "focused" : "";

  const className = `arkynCurrencyInput ${hasPrefix} ${hasSuffix} ${variant} ${size} ${opacity} ${errored} ${focused} ${baseClassName}`;

  return (
    <FieldWrapper>
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

        <input
          value={maskedValue}
          disabled={disabled || isLoading}
          readOnly={readOnly}
          ref={inputRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          id={inputId}
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

export { CurrencyInput };

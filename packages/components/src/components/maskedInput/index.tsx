import { InputMask, type Replacement } from "@react-input/mask";
import { Loader2, LucideIcon } from "lucide-react";
import {
  forwardRef,
  InputHTMLAttributes,
  useId,
  useRef,
  useState,
  type FocusEvent,
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
  name: string;
  mask: string;
  replacement: string | Replacement;

  separate?: boolean;
  showMask?: boolean;

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
};

const BaseInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return <input ref={ref} {...props} />;
});

/**
 * MaskedInput component - used for text input fields with input masking support, labels, validation, icons, and loading states
 *
 * @param props - MaskedInput component properties
 * @param props.name - Required field name for form handling
 * @param props.mask - Input mask pattern (e.g., "___.___.___-__" for CPF)
 * @param props.replacement - Character or replacement configuration for mask positions
 * @param props.separate - Whether to separate mask characters from input value. Default: undefined
 * @param props.showMask - Whether to show the mask placeholder. Default: undefined
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
 *
 * **...Other valid HTML properties for input element (except 'type' which is controlled by the mask)**
 *
 * @returns MaskedInput JSX element wrapped in FieldGroup with optional label and error
 *
 * @example
 * ```tsx
 * // Basic masked input for phone number
 * <MaskedInput
 *   name="phone"
 *   mask="(__) _____-____"
 *   replacement={{ _: /\d/ }}
 *   placeholder="(00) 00000-0000"
 * />
 *
 * // CPF input with label and validation
 * <MaskedInput
 *   name="cpf"
 *   label="CPF"
 *   mask="___.___.___-__"
 *   replacement="_"
 *   showAsterisk
 *   errorMessage="Please enter a valid CPF"
 *   showMask
 * />
 *
 * // Credit card input with icons and loading state
 * <MaskedInput
 *   name="creditCard"
 *   label="Credit Card"
 *   mask="____ ____ ____ ____"
 *   replacement={{ _: /\d/ }}
 *   leftIcon={CreditCardIcon}
 *   rightIcon={ShieldIcon}
 *   isLoading
 * />
 *
 * // Date input with prefix/suffix
 * <MaskedInput
 *   name="birthDate"
 *   label="Birth Date"
 *   mask="__/__/____"
 *   replacement="_"
 *   prefix="📅"
 *   variant="outline"
 *   separate
 * />
 *
 * // Large masked input with underline variant
 * <MaskedInput
 *   name="zipCode"
 *   label="ZIP Code"
 *   mask="_____-___"
 *   replacement={{ _: /\d/ }}
 *   size="lg"
 *   variant="underline"
 *   placeholder="00000-000"
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
    className: baseClassName = "",
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
    ...rest
  } = props;

  const { fieldErrors } = useForm();
  const [isFocused, setIsFocused] = useState(false);
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

  const hasPrefix = !!prefix ? "hasPrefix" : "";
  const hasSuffix = !!suffix ? "hasSuffix" : "";
  const errored = isError ? "errored" : "";
  const opacity = disabled || readOnly || isLoading ? "opacity" : "";
  const focused = isFocused ? "focused" : "";

  const className = `arkynMaskedInput ${hasPrefix} ${hasSuffix} ${variant} ${size} ${opacity} ${errored} ${focused} ${baseClassName}`;

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

        <InputMask
          component={BaseInput}
          mask={mask}
          replacement={replacement}
          separate={separate}
          showMask={showMask}
          ref={inputRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          readOnly={readOnly}
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

export { MaskedInput };

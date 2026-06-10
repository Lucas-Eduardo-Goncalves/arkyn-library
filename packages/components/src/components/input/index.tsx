import { Loader2, LucideIcon } from "lucide-react";
import {
  InputHTMLAttributes,
  useId,
  useRef,
  useState,
  type FocusEvent,
} from "react";

import { useForm } from "../../hooks/useForm";
import { FieldTemplate } from "../../services/fieldTemplate";
import { IconRenderer } from "../../services/iconRenderer";

import "./style.css";

type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "prefix" | "name" | "value" | "defaultValue"
> & {
  name: string;

  label?: string;
  errorMessage?: string;
  isLoading?: boolean;
  unShowFieldTemplate?: boolean;

  size?: "md" | "lg";
  variant?: "solid" | "outline" | "underline";

  prefix?: string | LucideIcon;
  suffix?: string | LucideIcon;
  showAsterisk?: boolean;
  orientation?: "horizontal" | "vertical" | "horizontalReverse";

  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;

  value?: string;
  defaultValue?: string;
};

/**
 * Input component - used for text input fields with support for labels, validation, icons, and loading states
 *
 * @param props - Input component properties
 * @param props.name - Required field name for form handling
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
 * @param props.unShowFieldTemplate - When true, skips `FieldTemplate` structure (wrapper, label and error text) and renders only the checkbox button content.
 * @param props.orientation - Layout direction forwarded to `FieldTemplate`/`FieldWrapper` (`horizontal`, `vertical`, `horizontalReverse`). Default: "horizontalReverse"
 *
 * **...Other valid HTML properties for input element**
 *
 * @returns Input JSX element wrapped in FieldGroup with optional label and error
 *
 * @example
 * ```tsx
 * // Basic input
 * <Input name="username" placeholder="Enter username" />
 *
 * // Input with label and validation
 * <Input
 *   name="email"
 *   label="Email Address"
 *   type="email"
 *   showAsterisk
 *   errorMessage="Please enter a valid email"
 * />
 *
 * // Input with icons and loading state
 * <Input
 *   name="search"
 *   label="Search"
 *   leftIcon={SearchIcon}
 *   rightIcon={FilterIcon}
 *   isLoading
 * />
 *
 * // Input with prefix/suffix
 * <Input
 *   name="website"
 *   label="Website"
 *   prefix="https://"
 *   suffix=".com"
 *   variant="outline"
 * />
 *
 * // Large input with underline variant
 * <Input
 *   name="title"
 *   label="Article Title"
 *   size="lg"
 *   variant="underline"
 *   placeholder="Enter article title"
 * />
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

  const hasPrefix = !!prefix ? "hasPrefix" : "";
  const hasSuffix = !!suffix ? "hasSuffix" : "";
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

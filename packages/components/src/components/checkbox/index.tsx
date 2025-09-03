import { Check } from "lucide-react";
import { ButtonHTMLAttributes, useId, useRef, useState } from "react";

import { useForm } from "../../hooks/useForm";
import { FieldWrapper } from "../fieldWrapper";

import { FieldError } from "../fieldError";
import { FieldLabel } from "../fieldLabel";
import "./styles.css";

type CheckboxProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | "size"
  | "prefix"
  | "type"
  | "name"
  | "defaultValue"
  | "value"
  | "onChange"
  | "onSelect"
  | "onClick"
> & {
  label?: string;
  errorMessage?: string;

  size?: "md" | "lg" | "sm";

  name: string;
  value?: string;

  checked?: boolean;
  defaultChecked?: boolean;
  onCheck?: (value: string) => void;
  orientation?: "horizontal" | "vertical" | "horizontalReverse";
};

/**
 * Checkbox component - used for creating interactive checkbox inputs with customizable styling and validation
 *
 * @param props - Checkbox component properties
 * @param props.name - Required field name for form handling and hidden input identification
 * @param props.label - Optional label text to display next to the checkbox
 * @param props.errorMessage - Error state indicator to display validation errors
 * @param props.size - Size variant of the checkbox. Default: "md"
 * @param props.value - Optional value to be used when checkbox is checked. Default: "checked"
 * @param props.checked - Controlled checked state of the checkbox
 * @param props.defaultChecked - Default checked state for uncontrolled usage. Default: false
 * @param props.onCheck - Callback function called when checkbox state changes, receives the value or empty string
 * @param props.orientation - Orientation of the checkbox and label. Default: "vertical"
 *
 * **...Other valid HTML properties for button element (except type, name, defaultValue, value, onChange, onSelect, onClick)**
 *
 * @returns Checkbox JSX element wrapped in FieldWrapper with optional label and error
 *
 * @example
 * ```tsx
 * // Basic checkbox
 * <Checkbox name="terms" label="I agree to the terms and conditions" />
 *
 * // Checkbox with custom value and validation
 * <Checkbox
 *   name="newsletter"
 *   label="Subscribe to newsletter"
 *   value="subscribed"
 *   errorMessage={errors.newsletter}
 * />
 *
 * // Large checkbox with controlled state
 * <Checkbox
 *   name="premium"
 *   label="Enable premium features"
 *   size="lg"
 *   checked={isPremium}
 *   onCheck={(value) => setIsPremium(!!value)}
 * />
 *
 * // Small checkbox with default checked state
 * <Checkbox
 *   name="remember"
 *   label="Remember me"
 *   size="sm"
 *   defaultChecked={true}
 *   value="remember_user"
 * />
 *
 * // Checkbox with custom styling and callback
 * <Checkbox
 *   name="notifications"
 *   label="Enable notifications"
 *   className="custom-checkbox"
 *   onCheck={(value) => console.log('Notification setting:', value)}
 *   disabled={isLoading}
 * />
 * ```
 */

function Checkbox(props: CheckboxProps) {
  const {
    id,
    name,
    className: baseClassName = "",
    size = "md",
    errorMessage: baseErrorMessage,
    defaultChecked = false,
    label,
    checked: baseChecked = null,
    onCheck,
    orientation,
    value,
    ...rest
  } = props;

  const { fieldErrors } = useForm();

  const checkboxRef = useRef<HTMLInputElement>(null);
  const checkboxId = id || useId();

  const errorMessage = baseErrorMessage || fieldErrors?.[name];
  const isError = !!errorMessage;

  const [isChecked, setIsChecked] = useState(defaultChecked || false);

  const currentChecked =
    typeof baseChecked === "boolean" ? baseChecked : isChecked;

  const errorClass = isError ? "errorTrue" : "errorFalse";
  const currentCheckedClass = currentChecked ? "checkedTrue" : "checkedFalse";

  const className = `arkynCheckbox ${size} ${errorClass} ${currentCheckedClass} ${baseClassName}`;

  function handleCheck() {
    const defaultChecked = isChecked;
    setIsChecked(!defaultChecked);
    onCheck && onCheck(!defaultChecked ? value || "checked" : "");
  }

  return (
    <FieldWrapper orientation={orientation}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <button
        id={checkboxId}
        type="button"
        className={className}
        onClick={handleCheck}
        {...rest}
      >
        <input
          type="hidden"
          name={name}
          ref={checkboxRef}
          value={currentChecked ? value || "checked" : ""}
        />

        <Check />
      </button>
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </FieldWrapper>
  );
}

export { Checkbox };

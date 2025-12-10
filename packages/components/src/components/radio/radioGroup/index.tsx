import { HTMLAttributes, useState } from "react";

import { FieldError } from "../../../components/fieldError";
import { FieldLabel } from "../../../components/fieldLabel";
import { FieldWrapper } from "../../../components/fieldWrapper";
import { useForm } from "../../../hooks/useForm";

import { RadioProvider } from "../radioContext";
import "./styles.css";

type RadioGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  name: string;
  label?: string;
  showAsterisk?: boolean;
  errorMessage?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
};

/**
 * RadioGroup component - used for creating a group of radio button options with shared state management
 *
 * @param props - RadioGroup component properties
 * @param props.name - Required field name for form handling and radio button grouping
 * @param props.label - Optional label text to display above the radio group
 * @param props.showAsterisk - Whether to show asterisk on label for required fields
 * @param props.errorMessage - Error message to display below the radio group
 * @param props.value - Controlled value for the selected radio option
 * @param props.defaultValue - Default selected value for uncontrolled usage. Default: ""
 * @param props.onChange - Callback function called when radio selection changes, receives the selected value
 * @param props.size - Size variant for all radio buttons in the group. Default: "md"
 *
 * **...Other valid HTML properties for div element (except onChange)**
 *
 * @returns RadioGroup JSX element wrapped in FieldWrapper with RadioProvider context for child Radio components
 *
 * @example
 * ```tsx
 * // Basic radio group
 * <RadioGroup name="gender">
 *   <Radio value="male" label="Male" />
 *   <Radio value="female" label="Female" />
 *   <Radio value="other" label="Other" />
 * </RadioGroup>
 *
 * // Radio group with label and validation
 * <RadioGroup
 *   name="subscription"
 *   label="Choose your plan"
 *   showAsterisk
 *   errorMessage="Please select a subscription plan"
 * >
 *   <Radio value="basic" label="Basic Plan - $9.99/month" />
 *   <Radio value="premium" label="Premium Plan - $19.99/month" />
 *   <Radio value="enterprise" label="Enterprise Plan - $49.99/month" />
 * </RadioGroup>
 *
 * // Controlled radio group with callback
 * <RadioGroup
 *   name="theme"
 *   label="Select Theme"
 *   value={selectedTheme}
 *   onChange={(value) => setSelectedTheme(value)}
 *   size="lg"
 * >
 *   <Radio value="light" label="Light Theme" />
 *   <Radio value="dark" label="Dark Theme" />
 *   <Radio value="auto" label="Auto (System)" />
 * </RadioGroup>
 *
 * // Radio group with default selection
 * <RadioGroup
 *   name="language"
 *   label="Preferred Language"
 *   defaultValue="en"
 *   size="sm"
 * >
 *   <Radio value="en" label="English" />
 *   <Radio value="es" label="Spanish" />
 *   <Radio value="fr" label="French" />
 *   <Radio value="pt" label="Portuguese" />
 * </RadioGroup>
 *
 * // Radio group with custom styling and onChange handler
 * <RadioGroup
 *   name="difficulty"
 *   label="Select Difficulty Level"
 *   className="custom-radio-group"
 *   onChange={(value) => console.log('Selected difficulty:', value)}
 * >
 *   <Radio value="easy" label="Easy" />
 *   <Radio value="medium" label="Medium" />
 *   <Radio value="hard" label="Hard" />
 * </RadioGroup>
 * ```
 */

function RadioGroup(props: RadioGroupProps) {
  const {
    defaultValue = "",
    name,
    label,
    showAsterisk,
    errorMessage: baseErrorMessage,
    value: forceValue,
    onChange,
    size = "md",
    className: wrapperClassName = "",
    disabled = false,
    ...rest
  } = props;

  const [value, setValue] = useState(defaultValue);
  const { fieldErrors } = useForm();

  function handleChange(value: string) {
    setValue(value);
    if (onChange) onChange(value);
  }

  const errorMessage = baseErrorMessage || fieldErrors?.[name];
  const isError = !!errorMessage;
  const className = `arkynRadioGroup ${size}`;

  return (
    <FieldWrapper className={wrapperClassName}>
      {label && <FieldLabel showAsterisk={showAsterisk}>{label}</FieldLabel>}
      <RadioProvider
        isError={isError}
        size={size}
        value={forceValue || value}
        handleChange={handleChange}
        disabled={disabled}
      >
        <input
          style={{ display: "none" }}
          type="text"
          readOnly
          name={name}
          value={forceValue || value}
        />

        <div className={className.trim()} {...rest} />
      </RadioProvider>
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </FieldWrapper>
  );
}

export { RadioGroup };

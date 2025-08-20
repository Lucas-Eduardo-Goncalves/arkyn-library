import { ButtonHTMLAttributes } from "react";

import { useForm } from "../../../hooks/useForm";
import { useRadioGroup } from "../radioContext";
import "./styles.css";

type RadioBoxProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
  isError?: boolean;
  size?: "sm" | "md" | "lg";
};

/**
 * RadioBox component - individual radio button option that must be used within a RadioGroup
 *
 * @param props - RadioBox component properties
 * @param props.value - Required unique value for this radio option within the group
 * @param props.isError - Optional error state indicator for styling
 * @param props.size - Size variant for the radio box, inherits from RadioGroup if not specified
 * @param props.children - Content to display next to the radio button (label text, icons, etc.)
 *
 * **...Other valid HTML properties for button element**
 *
 * @returns RadioBox JSX element wrapped in a label for accessibility
 *
 * @example
 * ```tsx
 * // Basic radio boxes within a group
 * <RadioGroup name="gender">
 *   <RadioBox value="male">Male</RadioBox>
 *   <RadioBox value="female">Female</RadioBox>
 *   <RadioBox value="other">Other</RadioBox>
 * </RadioGroup>
 *
 * // Radio boxes with rich content
 * <RadioGroup name="plan" label="Choose your plan">
 *   <RadioBox value="basic">
 *     <div>
 *       <h4>Basic Plan</h4>
 *       <p>$9.99/month - Perfect for individuals</p>
 *     </div>
 *   </RadioBox>
 *   <RadioBox value="premium">
 *     <div>
 *       <h4>Premium Plan</h4>
 *       <p>$19.99/month - Great for small teams</p>
 *     </div>
 *   </RadioBox>
 * </RadioGroup>
 *
 * // Radio boxes with custom size override
 * <RadioGroup name="priority" size="md">
 *   <RadioBox value="low" size="sm">Low Priority</RadioBox>
 *   <RadioBox value="medium">Medium Priority</RadioBox>
 *   <RadioBox value="high" size="lg">High Priority</RadioBox>
 * </RadioGroup>
 *
 * // Radio boxes with disabled state
 * <RadioGroup name="options">
 *   <RadioBox value="option1">Available Option</RadioBox>
 *   <RadioBox value="option2" disabled>Disabled Option</RadioBox>
 *   <RadioBox value="option3">Another Available Option</RadioBox>
 * </RadioGroup>
 *
 * // Radio boxes with custom styling
 * <RadioGroup name="theme">
 *   <RadioBox value="light" className="theme-option">
 *     🌞 Light Theme
 *   </RadioBox>
 *   <RadioBox value="dark" className="theme-option">
 *     🌙 Dark Theme
 *   </RadioBox>
 *   <RadioBox value="auto" className="theme-option">
 *     🔄 Auto Theme
 *   </RadioBox>
 * </RadioGroup>
 * ```
 *
 * @remarks
 * This component must be used as a child of RadioGroup. It automatically inherits:
 * - Group name for form handling
 * - Size from parent RadioGroup (unless overridden)
 * - Change handlers and state management
 * - Error states from form validation
 *
 * The component handles both click and focus events for accessibility.
 */

function RadioBox(props: RadioBoxProps) {
  const {
    value: componentValue,
    size: componentSize,
    disabled,
    children,
    className: baseClassName = "",
    ...rest
  } = props;

  const { handleChange, size: groupSize, value, isError } = useRadioGroup();

  const isChecked = value === componentValue;
  const size = componentSize || groupSize;

  const checkedClass = isChecked ? "checkedTrue" : "checkedFalse";
  const errorClass = !!isError ? "errorTrue" : "errorFalse";
  const disabledClass = disabled ? "disabledTrue" : "disabledFalse";
  const className = `arkynRadioBox ${size} ${checkedClass} ${errorClass} ${disabledClass} ${baseClassName}`;

  return (
    <label className={className.trim()}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => handleChange(componentValue)}
        onFocus={() => handleChange(componentValue)}
        {...rest}
      />

      {children}
    </label>
  );
}

export { RadioBox };

import type { ButtonHTMLAttributes } from "react";
import { useId, useRef, useState } from "react";

import "./styles.css";
import { FieldWrapper } from "../fieldWrapper";
import { FieldLabel } from "../fieldLabel";

type SwitchProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onChange" | "defaultValue" | "onCheck" | "value"
> & {
  label?: string;
  size?: "sm" | "md" | "lg";
  defaultChecked?: boolean;
  checked?: boolean;
  value?: string;
  unCheckedValue?: string;
  name: string;
  onCheck?: (value: string) => void;
};

/**
 * Switch component - used for creating toggle switches with on/off states
 *
 * @param props - Switch component properties
 * @param props.name - Required field name for form handling and input identification
 * @param props.label - Optional label text to display next to the switch
 * @param props.size - Size variant of the switch. Default: "lg"
 * @param props.defaultChecked - Default checked state for uncontrolled usage. Default: false
 * @param props.checked - Controlled checked state of the switch
 * @param props.value - Value to be used when switch is checked. Default: "checked"
 * @param props.unCheckedValue - Value to be used when switch is unchecked. Default: ""
 * @param props.onCheck - Callback function called when switch state changes, receives the current value
 *
 * **...Other valid HTML properties for button element (except children, onChange, defaultValue, onCheck, value)**
 *
 * @returns Switch JSX element wrapped in FieldWrapper with optional label
 *
 * @example
 * ```tsx
 * // Basic switch
 * <Switch name="notifications" label="Enable notifications" />
 *
 * // Switch with custom values
 * <Switch
 *   name="theme"
 *   label="Dark mode"
 *   value="dark"
 *   unCheckedValue="light"
 *   onCheck={(value) => console.log('Theme:', value)}
 * />
 *
 * // Controlled switch with callback
 * <Switch
 *   name="autoSave"
 *   label="Auto-save documents"
 *   checked={isAutoSaveEnabled}
 *   onCheck={(value) => setIsAutoSaveEnabled(!!value)}
 *   size="md"
 * />
 *
 * // Small switch with default checked state
 * <Switch
 *   name="marketing"
 *   label="Marketing emails"
 *   size="sm"
 *   defaultChecked={true}
 *   value="subscribed"
 *   unCheckedValue="unsubscribed"
 * />
 *
 * // Switch with custom styling and disabled state
 * <Switch
 *   name="premium"
 *   label="Premium features"
 *   className="premium-switch"
 *   disabled={!isPremiumUser}
 *   onCheck={(value) => handlePremiumToggle(value)}
 * />
 *
 * // Large switch for accessibility
 * <Switch
 *   name="accessibility"
 *   label="High contrast mode"
 *   size="lg"
 *   checked={isHighContrast}
 *   onCheck={(value) => setIsHighContrast(!!value)}
 *   value="enabled"
 *   unCheckedValue="disabled"
 * />
 *
 * // Switch without label for inline usage
 * <Switch
 *   name="inline_toggle"
 *   value="on"
 *   unCheckedValue="off"
 *   onCheck={(value) => console.log('Toggle state:', value)}
 * />
 * ```
 */

function Switch(props: SwitchProps) {
  const {
    label,
    size = "lg",
    defaultChecked = false,
    checked: baseChecked = null,
    value,
    unCheckedValue = "",
    name,
    className: baseClassName = "",
    onCheck,
    id,
    ...rest
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = id || useId();

  const [isChecked, setIsChecked] = useState(defaultChecked);

  const currentChecked =
    typeof baseChecked === "boolean" ? baseChecked : isChecked;

  function handleCheck() {
    setIsChecked(!isChecked);
    onCheck && onCheck(!currentChecked ? value || "checked" : unCheckedValue);
  }

  const checkedClass = currentChecked ? "checkedTrue" : "checkedFalse";
  const className = `arkynSwitch ${checkedClass} ${size} ${baseClassName}`;

  return (
    <FieldWrapper>
      {label && <FieldLabel>{label}</FieldLabel>}

      <button
        type="button"
        onClick={handleCheck}
        className={className}
        {...rest}
      >
        <input
          id={inputId}
          type="hidden"
          name={name}
          ref={inputRef}
          onClick={handleCheck}
          value={currentChecked ? value || "checked" : unCheckedValue}
        />
      </button>
    </FieldWrapper>
  );
}

export { Switch };

import type { ButtonHTMLAttributes } from "react";
import { useId, useRef, useState } from "react";

import { FieldTemplate } from "../../services/fieldTemplate";
import "./styles.css";

type SwitchProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	"children" | "onChange" | "defaultValue" | "onCheck" | "value"
> & {
	/** Optional label text displayed beside the switch. */
	label?: string;
	/**
	 * Switch size.
	 * @default "lg"
	 */
	size?: "sm" | "md" | "lg";
	/** Uncontrolled initial checked state. @default false */
	defaultChecked?: boolean;
	/** Controlled checked state. */
	checked?: boolean;
	/** Value emitted when the switch is on. @default "checked" */
	value?: string;
	/** Value emitted when the switch is off. @default "" */
	unCheckedValue?: string;
	/** Field name for form submission. Required. */
	name: string;
	/** Callback fired on toggle — receives the current value string. */
	onCheck?: (value: string) => void;
	/**
	 * Layout direction forwarded to `FieldTemplate`.
	 * @default "horizontalReverse"
	 */
	orientation?: "vertical" | "horizontal" | "horizontalReverse";
	/** When true, skips `FieldTemplate` wrapper (label and error text). @default false */
	unShowFieldTemplate?: boolean;
	/** Displays an asterisk on the label to signal a required field. */
	showAsterisk?: boolean;
	/** Validation error message displayed below the switch. */
	errorMessage?: string;
};

/**
 * Switch — toggle input for binary on/off states.
 *
 * Stores value in a hidden `<input>` for native form submission.
 * Integrates with `useForm` to display validation errors by field name.
 *
 * @param props.name - Field name for form submission. Required.
 * @param props.label - Label text displayed beside the switch.
 * @param props.size - Switch size (`sm` | `md` | `lg`). Default: "lg"
 * @param props.defaultChecked - Uncontrolled initial checked state. Default: false
 * @param props.checked - Controlled checked state.
 * @param props.value - Value emitted when on. Default: "checked"
 * @param props.unCheckedValue - Value emitted when off. Default: ""
 * @param props.onCheck - Callback fired on toggle — receives the current value string.
 * @param props.orientation - Layout direction (`horizontal` | `vertical` | `horizontalReverse`). Default: "horizontalReverse"
 * @param props.unShowFieldTemplate - Skips wrapper, label, and error rendering. Default: false
 * @param props.showAsterisk - Appends `*` to the label.
 * @param props.errorMessage - Validation error message.
 *
 * **...Other valid HTML properties for `<button>` (except `children`, `onChange`, `defaultValue`)**
 *
 * @returns Switch JSX element wrapped in `FieldTemplate`.
 *
 * @example
 * ```tsx
 * // Basic
 * <Switch name="notifications" label="Enable notifications" />
 *
 * // Custom on/off values
 * <Switch
 *   name="theme"
 *   label="Dark mode"
 *   value="dark"
 *   unCheckedValue="light"
 *   onCheck={(v) => setTheme(v)}
 * />
 *
 * // Controlled
 * <Switch
 *   name="autoSave"
 *   label="Auto-save"
 *   checked={isAutoSaveEnabled}
 *   onCheck={(v) => setAutoSave(!!v)}
 *   size="md"
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
		orientation = "horizontalReverse",
		className: wrapperClassName = "",
		showAsterisk,
		errorMessage,
		unShowFieldTemplate = false,
		...rest
	} = props;

	const inputRef = useRef<HTMLInputElement>(null);
	const inputId = id || useId();

	const [isChecked, setIsChecked] = useState(defaultChecked);

	const currentChecked =
		typeof baseChecked === "boolean" ? baseChecked : isChecked;

	function handleCheck() {
		setIsChecked(!isChecked);
		onCheck?.(!currentChecked ? value || "checked" : unCheckedValue);
	}

	const checkedClass = currentChecked ? "checkedTrue" : "checkedFalse";
	const className = `arkynSwitch ${checkedClass} ${size} ${baseClassName}`;

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
		</FieldTemplate>
	);
}

export { Switch };

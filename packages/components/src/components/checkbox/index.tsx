import { Check } from "lucide-react";
import { type ButtonHTMLAttributes, useId, useRef, useState } from "react";

import { useForm } from "../../hooks/useForm";
import { FieldTemplate } from "../../services/fieldTemplate";

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
	/** Optional label text displayed beside the checkbox. */
	label?: string;
	/** Displays an asterisk on the label to signal a required field. */
	showAsterisk?: boolean;
	/** When true, skips `FieldTemplate` wrapper (label and error text). @default false */
	unShowFieldTemplate?: boolean;
	/** Validation error message displayed below the checkbox. */
	errorMessage?: string;
	/**
	 * Checkbox size.
	 * @default "md"
	 */
	size?: "md" | "lg" | "sm";
	/** Field name for form submission. Required. */
	name: string;
	/** Value stored in the hidden input when checked. @default "checked" */
	value?: string;
	/** Controlled checked state. */
	checked?: boolean;
	/** Uncontrolled initial checked state. @default false */
	defaultChecked?: boolean;
	/** Callback fired on toggle — receives the value string (or `""` when unchecked). */
	onCheck?: (value: string) => void;
	/**
	 * Layout direction forwarded to `FieldTemplate`.
	 * @default "horizontalReverse"
	 */
	orientation?: "horizontal" | "vertical" | "horizontalReverse";
};

/**
 * Checkbox — interactive checkbox input with label, validation, and form integration.
 *
 * Stores value in a hidden `<input>` for native form submission.
 * Integrates with `useForm` to display validation errors by field name.
 *
 * @param props.name - Field name for form submission. Required.
 * @param props.label - Label text displayed beside the checkbox.
 * @param props.size - Checkbox size (`sm` | `md` | `lg`). Default: "md"
 * @param props.value - Value stored when checked. Default: "checked"
 * @param props.checked - Controlled checked state.
 * @param props.defaultChecked - Uncontrolled initial checked state. Default: false
 * @param props.onCheck - Callback fired on toggle — receives value or `""` when unchecked.
 * @param props.errorMessage - Validation error message.
 * @param props.showAsterisk - Appends `*` to the label.
 * @param props.orientation - Layout direction (`horizontal` | `vertical` | `horizontalReverse`). Default: "horizontalReverse"
 * @param props.unShowFieldTemplate - Skips wrapper, label, and error rendering. Default: false
 *
 * **...Other valid HTML properties for `<button>` (except `type`, `name`, `defaultValue`, `value`, `onChange`, `onSelect`, `onClick`)**
 *
 * @returns Checkbox JSX element wrapped in `FieldTemplate`.
 *
 * @example
 * ```tsx
 * // Basic
 * <Checkbox name="terms" label="I agree to the terms and conditions" />
 *
 * // With custom value and error
 * <Checkbox
 *   name="newsletter"
 *   label="Subscribe to newsletter"
 *   value="subscribed"
 *   errorMessage={errors.newsletter}
 * />
 *
 * // Controlled
 * <Checkbox
 *   name="premium"
 *   label="Enable premium features"
 *   size="lg"
 *   checked={isPremium}
 *   onCheck={(v) => setIsPremium(!!v)}
 * />
 * ```
 */

function Checkbox(props: CheckboxProps) {
	const {
		id,
		name,
		className: wrapperClassName = "",
		size = "md",
		errorMessage: baseErrorMessage,
		defaultChecked = false,
		label,
		checked: baseChecked = null,
		onCheck,
		orientation = "horizontalReverse",
		showAsterisk,
		unShowFieldTemplate,
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

	const className = `arkynCheckbox ${size} ${errorClass} ${currentCheckedClass}`;

	function handleCheck() {
		const defaultChecked = isChecked;
		setIsChecked(!defaultChecked);
		onCheck?.(!defaultChecked ? value || "checked" : "");
	}

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
		</FieldTemplate>
	);
}

export { Checkbox };

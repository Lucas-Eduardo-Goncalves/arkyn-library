import { type HTMLAttributes, useState } from "react";

import { useForm } from "../../../hooks/useForm";
import { FieldTemplate } from "../../../services/fieldTemplate";

import { RadioProvider } from "../radioContext";
import "./styles.css";

type RadioGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
	/** Field name used for form submission. Required. */
	name: string;
	/** Label displayed above the group. */
	label?: string;
	/** Appends an asterisk to the label. @default false */
	showAsterisk?: boolean;
	/** Error message shown below the group. Overrides `fieldErrors[name]` from `FormProvider`. */
	errorMessage?: string;
	/** Controlled selected value. */
	value?: string;
	/** Initial selected value (uncontrolled). @default "" */
	defaultValue?: string;
	/** Callback fired when the selected option changes. */
	onChange?: (value: string) => void;
	/** Size variant applied to all `RadioBox` children. @default "md" */
	size?: "sm" | "md" | "lg";
	/** Disables all `RadioBox` children. @default false */
	disabled?: boolean;
	/** When `true`, skips the `FieldTemplate` wrapper (label, error message). @default false */
	unShowFieldTemplate?: boolean;
	/** Layout direction of the `FieldWrapper`. @default "horizontal" */
	orientation?: "horizontal" | "vertical" | "horizontalReverse";
};

/**
 * RadioGroup — managed group of `RadioBox` options with form integration.
 *
 * Renders a hidden `<input>` for native form submission. Reads `fieldErrors[name]` from
 * the nearest `FormProvider` when no `errorMessage` is explicitly provided.
 *
 * @param props.name - Form field name. Required.
 * @param props.label - Label displayed above the group.
 * @param props.showAsterisk - Appends `*` to the label. Default: false
 * @param props.value - Controlled selection.
 * @param props.defaultValue - Initial selection (uncontrolled). Default: `""`
 * @param props.onChange - Called with the newly selected value.
 * @param props.size - Size for all child `RadioBox` elements. Default: `"md"`
 * @param props.disabled - Disables all options. Default: false
 * @param props.errorMessage - Validation error message.
 * @param props.unShowFieldTemplate - Omit label/error wrapper. Default: false
 *
 * **...Other valid HTML `<div>` properties**
 *
 * @returns RadioGroup JSX element.
 *
 * @example
 * ```tsx
 * // Uncontrolled with label
 * <RadioGroup name="gender" label="Gender" showAsterisk defaultValue="male">
 *   <RadioBox value="male">Male</RadioBox>
 *   <RadioBox value="female">Female</RadioBox>
 *   <RadioBox value="other">Other</RadioBox>
 * </RadioGroup>
 *
 * // Controlled with change handler
 * <RadioGroup name="plan" label="Subscription plan" value={plan} onChange={setPlan}>
 *   <RadioBox value="basic">Basic — $9/mo</RadioBox>
 *   <RadioBox value="pro">Pro — $29/mo</RadioBox>
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
		unShowFieldTemplate = false,
		orientation = "vertical",
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
		<FieldTemplate
			name={name}
			label={label}
			showAsterisk={showAsterisk}
			className={wrapperClassName}
			errorMessage={errorMessage}
			unShowFieldTemplate={unShowFieldTemplate}
			orientation={orientation}
		>
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
		</FieldTemplate>
	);
}

export { RadioGroup };

import type { ButtonHTMLAttributes } from "react";

import { useRadioGroup } from "../radioContext";
import "./styles.css";

type RadioBoxProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	/** Value submitted to the form when this option is selected. Required. */
	value: string;
	/** Applies error styling. Inherited from `RadioGroup` when not set. */
	isError?: boolean;
	/** Size variant. Inherits from `RadioGroup` when not set. */
	size?: "sm" | "md" | "lg";
};

/**
 * RadioBox — individual option inside a `RadioGroup`. Renders as a `<label>` + hidden `<button>` pair.
 *
 * Reads active value, size, error state, and disabled state from `RadioGroup` context.
 * Must be used as a direct child of `RadioGroup`.
 *
 * @param props.value - Option value. Required.
 * @param props.children - Option label content (text, icons, or rich markup).
 * @param props.disabled - Disables this option (group can also disable all options).
 * @param props.size - Size override. Inherits from group by default.
 *
 * **...Other valid HTML `<button>` properties**
 *
 * @returns RadioBox JSX element.
 *
 * @example
 * ```tsx
 * <RadioGroup name="plan" label="Choose a plan" onChange={setPlan}>
 *   <RadioBox value="basic">Basic — $9/mo</RadioBox>
 *   <RadioBox value="pro">Pro — $29/mo</RadioBox>
 *   <RadioBox value="enterprise" disabled>Enterprise — contact us</RadioBox>
 * </RadioGroup>
 * ```
 */

function RadioBox(props: RadioBoxProps) {
	const {
		value: componentValue,
		size: componentSize,
		disabled,
		children,
		className: baseClassName = "",
		onClick,
		onFocus,
		...rest
	} = props;

	const {
		handleChange,
		size: groupSize,
		value,
		isError,
		disabled: groupDisabled,
	} = useRadioGroup();

	const isChecked = value === componentValue;
	const size = componentSize || groupSize;

	const isDisabled = disabled || groupDisabled;

	const checkedClass = isChecked ? "checkedTrue" : "checkedFalse";
	const errorClass = isError ? "errorTrue" : "errorFalse";
	const disabledClass = isDisabled ? "disabledTrue" : "disabledFalse";
	const className = `arkynRadioBox ${size} ${checkedClass} ${errorClass} ${disabledClass} ${baseClassName}`;

	function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
		onClick?.(event);
		handleChange(componentValue);
	}

	function handleFocus(event: React.FocusEvent<HTMLButtonElement>) {
		onFocus?.(event);
		handleChange(componentValue);
	}

	return (
		<label className={className.trim()}>
			<button
				type="button"
				disabled={isDisabled}
				onClick={handleClick}
				onFocus={handleFocus}
				{...rest}
			/>

			{children}
		</label>
	);
}

export { RadioBox };

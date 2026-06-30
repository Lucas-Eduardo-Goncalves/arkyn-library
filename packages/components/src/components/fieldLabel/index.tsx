import type { LabelHTMLAttributes } from "react";
import "./styles.css";

type FieldLabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
	/** When true, appends an asterisk (*) to signal a required field. @default false */
	showAsterisk?: boolean;
};

/**
 * FieldLabel — label for form fields, with an optional required-field asterisk.
 *
 * @param props.showAsterisk - Appends `*` to the label. Default: false
 *
 * **...Other valid HTML properties for `<label>`**
 *
 * @returns FieldLabel JSX element.
 *
 * @example
 * ```tsx
 * <FieldLabel htmlFor="email" showAsterisk>Email Address</FieldLabel>
 * ```
 */

function FieldLabel(props: FieldLabelProps) {
	const {
		showAsterisk = false,
		className: baseClassName = "",
		...rest
	} = props;

	const show = showAsterisk ? "asteriskTrue" : "asteriskFalse";
	const className = `arkynFieldLabel ${show} ${baseClassName}`;

	// biome-ignore lint/a11y/noLabelWithoutControl: htmlFor is passed via ...rest
	return <label className={className.trim()} {...rest} />;
}

export { FieldLabel };

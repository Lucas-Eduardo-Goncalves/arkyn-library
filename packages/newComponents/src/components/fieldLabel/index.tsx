import { LabelHTMLAttributes } from "react";
import "./styles.css";

type FieldLabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  showAsterisk?: boolean;
};

/**
 * FieldLabel component - used to display labels for form fields with optional required indicator
 *
 * @param props - FieldLabel component properties
 * @param props.showAsterisk - Whether to display an asterisk (*) to indicate required field. Default: false
 *
 * **...Other valid HTML properties for label element**
 *
 * @returns FieldLabel JSX element
 *
 * @example
 * ```tsx
 * // Basic field label
 * <FieldLabel htmlFor="username">Username</FieldLabel>
 *
 * // Required field label with asterisk
 * <FieldLabel htmlFor="email" showAsterisk>
 *   Email Address
 * </FieldLabel>
 *
 * // Label with custom styling
 * <FieldLabel
 *   htmlFor="password"
 *   className="custom-label"
 *   showAsterisk
 * >
 *   Password
 * </FieldLabel>
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

  return <label className={className.trim()} {...rest} />;
}

export { FieldLabel };

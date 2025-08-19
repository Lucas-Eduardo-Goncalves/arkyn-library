import { HTMLAttributes } from "react";
import "./styles.css";

type FieldErrorProps = HTMLAttributes<HTMLElement>;

/**
 * FieldError component - used to display error messages for form fields
 *
 * @param props - FieldError component properties
 *
 * **...Other valid HTML properties for strong element**
 *
 * @returns FieldError JSX element or empty fragment if no children
 *
 * @example
 * ```tsx
 * // Basic field error
 * <FieldError>This field is required</FieldError>
 *
 * // Field error with custom styling
 * <FieldError className="custom-error">
 *  Invalid email format
 * </FieldError>
 *
 * // Conditional field error
 * {error && <FieldError>{error}</FieldError>}
 * ```
 */

function FieldError(props: FieldErrorProps) {
  const { children, className: baseClassName, ...rest } = props;
  const className = `arkynFieldError ${baseClassName}`;

  if (!children) return <></>;

  return (
    <strong className={className.trim()} {...rest}>
      {children}
    </strong>
  );
}

export { FieldError };

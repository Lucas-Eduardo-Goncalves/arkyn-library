import { HTMLAttributes } from "react";
import "./styles.css";

type FieldErrorProps = HTMLAttributes<HTMLElement>;

/**
 * FieldError — displays a validation error message below a form field.
 *
 * Renders nothing when `children` is empty or falsy.
 *
 * **...Other valid HTML properties for `<strong>`**
 *
 * @returns FieldError `<strong>` element, or an empty fragment when there is no message.
 *
 * @example
 * ```tsx
 * <FieldError>This field is required</FieldError>
 *
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

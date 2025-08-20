import { HTMLAttributes, ReactNode } from "react";
import "./styles.css";

type FieldWrapperProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

/**
 * FieldWrapper component - used as a container wrapper for a single form field and its related elements
 *
 * @param props - FieldWrapper component properties
 * @param props.children - React elements that compose a single field (label, input, error message, etc.)
 *
 * **...Other valid HTML properties for section element**
 *
 * @returns FieldWrapper JSX element
 *
 * @example
 * ```tsx
 * // Basic field container
 * <FieldWrapper>
 *   <FieldLabel>Username</FieldLabel>
 *   <Input name="username" />
 *   <FieldError>This field is required</FieldError>
 * </FieldWrapper>
 *
 * // Field container with custom styling
 * <FieldWrapper className="custom-spacing">
 *   <FieldLabel>Email</FieldLabel>
 *   <Input name="email" type="email" />
 * </FieldWrapper>
 *
 * // Complete field with all elements
 * <FieldWrapper>
 *   <FieldLabel showAsterisk>Password</FieldLabel>
 *   <Input name="password" type="password" />
 *   <FieldError>Password must be at least 8 characters</FieldError>
 * </FieldWrapper>
 * ```
 */

function FieldWrapper(props: FieldWrapperProps) {
  const { children, className: baseClassName, ...rest } = props;

  const className = `arkynFieldWrapper ${baseClassName}`;

  return (
    <section className={className.trim()} {...rest}>
      {children}
    </section>
  );
}

export { FieldWrapper };

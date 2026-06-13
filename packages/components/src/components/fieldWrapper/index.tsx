import { HTMLAttributes, ReactNode } from "react";
import "./styles.css";

type FieldWrapperProps = HTMLAttributes<HTMLElement> & {
  /** Field elements to render inside the wrapper (label, input, error, etc.). Required. */
  children: ReactNode;
  /**
   * Layout orientation of the wrapper.
   * @default "vertical"
   */
  orientation?: "vertical" | "horizontal" | "horizontalReverse";
};

/**
 * FieldWrapper — `<section>` container that groups a form field with its label and error message.
 *
 * @param props.children - Field elements (label, input, error, etc.).
 * @param props.orientation - Layout direction. Default: "vertical"
 *
 * **...Other valid HTML properties for `<section>`**
 *
 * @returns FieldWrapper JSX element.
 *
 * @example
 * ```tsx
 * <FieldWrapper>
 *   <FieldLabel showAsterisk>Email</FieldLabel>
 *   <Input name="email" type="email" />
 *   <FieldError>Invalid email address</FieldError>
 * </FieldWrapper>
 * ```
 */

function FieldWrapper(props: FieldWrapperProps) {
  const {
    children,
    className: baseClassName,
    orientation = "vertical",
    ...rest
  } = props;

  const className = `arkynFieldWrapper ${baseClassName} ${orientation}`;

  return (
    <section className={className.trim()} {...rest}>
      {children}
    </section>
  );
}

export { FieldWrapper };

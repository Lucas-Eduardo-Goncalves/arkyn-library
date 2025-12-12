import { HTMLAttributes, JSX } from "react";
import "./styles.css";

/**
 * @typedef {Object} AlertContentProps
 * @extends {HTMLAttributes<HTMLDivElement>}
 * @description Props for the AlertContent component, extending standard HTML div attributes.
 */
type AlertContentProps = HTMLAttributes<HTMLDivElement>;

/**
 * AlertContent component that renders the main content area of an alert.
 *
 * @component
 * @memberof Alert
 *
 * @description
 * This component serves as a container for the main content within an Alert component.
 * Supports all standard HTML div attributes for maximum flexibility.
 *
 * @param {AlertContentProps} props - Component props extending HTMLDivElement attributes
 * @param {string} [props.className] - Additional CSS classes to apply to the content container
 * @param {React.ReactNode} [props.children] - Content to be displayed inside the alert
 *
 * @returns {JSX.Element} A div element with the alert content styling
 *
 * @requires react
 *
 * @example
 * // Basic usage
 * <AlertContainer schema="success">
 *  <AlertContent>
 *   {children}
 *  </AlertContent>
 * </AlertContainer>
 *
 * @example
 * // Complete alert example
 * <AlertContainer schema="success">
 *  <AlertIcon />
 *  <AlertContent>
 *    <AlertTitle>Success!</AlertTitle>
 *    <AlertDescription>
 *      You are premium user now!
 *    </AlertDescription>
 *  </AlertContent>
 * </AlertContainer>
 */

function AlertContent(props: AlertContentProps): JSX.Element {
  const { className: baseClassName, ...rest } = props;
  const className = `arkynAlertContent ${baseClassName}`;

  return <div className={className.trim()} {...rest} />;
}

export { AlertContent };

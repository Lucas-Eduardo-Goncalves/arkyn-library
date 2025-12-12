import { HTMLAttributes, JSX } from "react";
import "./styles.css";

/**
 * Props for the AlertTitle component.
 * Extends all standard HTML div element attributes.
 *
 * @typedef {Object} AlertTitleProps
 * @property {string} [className] - Additional CSS class names to apply to the alert title
 * @extends {HTMLAttributes<HTMLDivElement>}
 */
type AlertTitleProps = HTMLAttributes<HTMLDivElement>;

/**
 * AlertTitle component - Displays the title section of an alert message.
 *
 * This component renders a styled title for alert components, providing semantic structure
 * and consistent styling across the application.
 *
 * @component
 * @memberof Alert
 *
 * @param {AlertTitleProps} props - Component props extending HTML div attributes
 *
 * @returns {JSX.Element} A div element with alert title styling
 *
 * @requires react
 *
 * @example
 * // Basic usage
 * <AlertContainer schema="success">
 *   <AlertTitle>Success!</AlertTitle>
 *   <AlertDescription>Your changes have been saved.</AlertDescription>
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
function AlertTitle(props: AlertTitleProps): JSX.Element {
  const { className: baseClassName, ...rest } = props;
  const className = `arkynAlertTitle ${baseClassName}`;

  return <div className={className.trim()} {...rest} />;
}

export { AlertTitle };

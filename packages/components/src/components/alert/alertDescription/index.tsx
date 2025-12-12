import { HTMLAttributes, JSX } from "react";
import "./styles.css";

/**
 * Props for the AlertDescription component.
 * @typedef {Object} AlertDescriptionProps
 * @extends {HTMLAttributes<HTMLDivElement>}
 */
type AlertDescriptionProps = HTMLAttributes<HTMLDivElement>;

/**
 * AlertDescription component displays descriptive text content within an Alert component.
 *
 * This component provides a semantic wrapper for alert descriptions with appropriate styling
 * through the `arkynAlertDescription` CSS class. It extends all standard HTML div attributes,
 * making it flexible for various content and accessibility requirements.
 *
 * @component
 * @memberof Alert
 *
 * @param {AlertDescriptionProps} props - Component props extending HTML div attributes
 * @param {string} [props.className] - Additional CSS classes to apply to the description
 * @param {React.ReactNode} [props.children] - The description content to display
 *
 * @returns {JSX.Element} A div element with alert description styling
 *
 * @requires react
 *
 * @example
 * // Basic usage
 * <AlertContainer schema="success">
 *  <AlertContent>
 *    <AlertDescription>
 *      Your are premium user now!
 *    </AlertDescription>
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

function AlertDescription(props: AlertDescriptionProps): JSX.Element {
  const { className: baseClassName, ...rest } = props;
  const className = `arkynAlertDescription ${baseClassName}`;

  return <div className={className.trim()} {...rest} />;
}

export { AlertDescription };

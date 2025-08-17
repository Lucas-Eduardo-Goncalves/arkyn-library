import { HTMLAttributes } from "react";
import "./styles.css";

type AlertTitleProps = HTMLAttributes<HTMLDivElement>;

/**
 * AlertTitle component - used to display the main title/heading of alerts
 *
 * @param args - AlertTitle component properties
 * ...Other valid HTML properties for div
 *
 * @returns AlertTitle JSX element
 *
 * @description
 * This component affects the layout of the AlertContainer. When present, the container
 * content will be aligned differently compared to alerts without a title.
 *
 * @example
 * ```tsx
 * // Basic alert with title
 * <AlertContainer schema="info">
 *   <AlertTitle>Information</AlertTitle>
 *   <AlertDescription>This is important information.</AlertDescription>
 * </AlertContainer>
 *
 * // Success alert with title and icon
 * <AlertContainer schema="success">
 *   <AlertIcon />
 *   <AlertTitle>Success!</AlertTitle>
 *   <AlertDescription>Your operation was completed.</AlertDescription>
 * </AlertContainer>
 *
 * // Error alert with custom styling
 * <AlertContainer schema="danger">
 *   <AlertIcon />
 *   <AlertTitle className="custom-title">
 *     Critical Error
 *   </AlertTitle>
 *   <AlertDescription>
 *     Please contact support immediately.
 *   </AlertDescription>
 * </AlertContainer>
 * ```
 */

function AlertTitle(props: AlertTitleProps) {
  const { className: baseClassName, ...rest } = props;
  const className = `arkynAlertTitle ${baseClassName}`;

  return <div className={className.trim()} {...rest} />;
}

export { AlertTitle };

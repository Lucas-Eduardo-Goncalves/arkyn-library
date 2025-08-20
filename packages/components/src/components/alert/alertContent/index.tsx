import { HTMLAttributes } from "react";
import "./styles.css";

type AlertContentProps = HTMLAttributes<HTMLDivElement>;

/**
 * AlertContent component - used to wrap and style the main content area of alerts
 *
 * @param props - AlertContent component properties
 *
 * **...Other valid HTML properties for div**
 *
 * @returns AlertContent JSX element
 *
 * @example
 * ```tsx
 * // Basic alert content
 * <AlertContainer schema="info">
 *   <AlertContent>
 *     This is the main alert message content.
 *   </AlertContent>
 * </AlertContainer>
 *
 * // Alert with title and content
 * <AlertContainer schema="success">
 *   <AlertContent>
 *     <AlertTitle>Success</AlertTitle>
 *     Your operation has been completed successfully.
 *   </AlertContent>
 * </AlertContainer>
 *
 * // Multiple content sections
 * <AlertContainer schema="warning">
 *   <AlertContent>
 *     <AlertTitle>Warning</AlertTitle>
 *     <p>Please review the following items:</p>
 *     <ul>
 *       <li>Check your input data</li>
 *       <li>Verify permissions</li>
 *     </ul>
 *   </AlertContent>
 * </AlertContainer>
 * ```
 */

function AlertContent(props: AlertContentProps) {
  const { className: baseClassName, ...rest } = props;
  const className = `arkynAlertContent ${baseClassName}`;

  return <div className={className.trim()} {...rest} />;
}

export { AlertContent };

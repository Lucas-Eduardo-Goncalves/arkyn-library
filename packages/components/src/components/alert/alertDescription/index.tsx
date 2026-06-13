import { HTMLAttributes, JSX } from "react";
import "./styles.css";

type AlertDescriptionProps = HTMLAttributes<HTMLDivElement>;

/**
 * AlertDescription — body text for an alert. Place inside `AlertContent`.
 *
 * Accepts all standard `<div>` HTML attributes.
 *
 * @returns AlertDescription JSX element.
 *
 * @example
 * ```tsx
 * <AlertContainer schema="info">
 *   <AlertContent>
 *     <AlertTitle>Maintenance scheduled</AlertTitle>
 *     <AlertDescription>The service will be unavailable on Sunday from 2–4 AM UTC.</AlertDescription>
 *   </AlertContent>
 * </AlertContainer>
 * ```
 */

function AlertDescription(props: AlertDescriptionProps): JSX.Element {
  const { className: baseClassName, ...rest } = props;
  const className = `arkynAlertDescription ${baseClassName}`;

  return <div className={className.trim()} {...rest} />;
}

export { AlertDescription };

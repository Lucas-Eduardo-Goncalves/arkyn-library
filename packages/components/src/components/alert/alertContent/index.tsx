import type { HTMLAttributes, JSX } from "react";
import "./styles.css";

type AlertContentProps = HTMLAttributes<HTMLDivElement>;

/**
 * AlertContent — text/content area inside an `AlertContainer`. Wraps `AlertTitle` and `AlertDescription`.
 *
 * Accepts all standard `<div>` HTML attributes.
 *
 * @returns AlertContent JSX element.
 *
 * @example
 * ```tsx
 * <AlertContainer schema="warning">
 *   <AlertIcon />
 *   <AlertContent>
 *     <AlertTitle>Session expiring</AlertTitle>
 *     <AlertDescription>You will be logged out in 5 minutes.</AlertDescription>
 *   </AlertContent>
 * </AlertContainer>
 * ```
 */

function AlertContent(props: AlertContentProps): JSX.Element {
	const { className: baseClassName, ...rest } = props;
	const className = `arkynAlertContent ${baseClassName}`;

	return <div className={className.trim()} {...rest} />;
}

export { AlertContent };

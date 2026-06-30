import type { HTMLAttributes, JSX } from "react";
import "./styles.css";

type AlertTitleProps = HTMLAttributes<HTMLDivElement>;

/**
 * AlertTitle — bold heading for an alert. Place inside `AlertContent`.
 *
 * Its presence is detected by `AlertContainer` to switch the layout from centered to left-aligned.
 * Accepts all standard `<div>` HTML attributes.
 *
 * @returns AlertTitle JSX element.
 *
 * @example
 * ```tsx
 * <AlertContainer scheme="danger">
 *   <AlertIcon />
 *   <AlertContent>
 *     <AlertTitle>Access denied</AlertTitle>
 *     <AlertDescription>You don't have permission to view this page.</AlertDescription>
 *   </AlertContent>
 * </AlertContainer>
 * ```
 */
function AlertTitle(props: AlertTitleProps): JSX.Element {
	const { className: baseClassName, ...rest } = props;
	const className = `arkynAlertTitle ${baseClassName}`;

	return <div className={className.trim()} {...rest} />;
}

export { AlertTitle };

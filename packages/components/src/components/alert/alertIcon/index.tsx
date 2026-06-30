import {
	AlertTriangle,
	CheckCircle2,
	Info,
	type LucideProps,
	XCircle,
} from "lucide-react";

import type { JSX } from "react";
import { useAlertContainer } from "../alertContainer";
import "./styles.css";

type AlertIconProps = LucideProps;

/**
 * AlertIcon — renders a scheme-appropriate icon from `AlertContainer` context.
 *
 * - `success` → `CheckCircle2`
 * - `danger` → `XCircle`
 * - `warning` → `AlertTriangle`
 * - `info` → `Info`
 *
 * Must be placed inside an `AlertContainer`. Accepts all Lucide icon props.
 *
 * @returns The scheme-matched Lucide icon element.
 *
 * @example
 * ```tsx
 * <AlertContainer scheme="danger">
 *   <AlertIcon />
 *   <AlertContent>
 *     <AlertTitle>Payment failed</AlertTitle>
 *     <AlertDescription>Please check your card details.</AlertDescription>
 *   </AlertContent>
 * </AlertContainer>
 * ```
 */
function AlertIcon(props: AlertIconProps): JSX.Element {
	const { className: baseClassName, ...rest } = props;
	const { scheme } = useAlertContainer();

	const className = `arkynAlertIcon ${scheme} ${baseClassName}`;

	switch (scheme) {
		case "success":
			return <CheckCircle2 className={className} {...rest} />;
		case "danger":
			return <XCircle className={className} {...rest} />;
		case "warning":
			return <AlertTriangle className={className} {...rest} />;
		case "info":
			return <Info className={className} {...rest} />;
	}
}

export { AlertIcon };

import {
	createContext,
	type HTMLAttributes,
	type JSX,
	type ReactNode,
	useContext,
} from "react";
import { AlertTitle } from "../alertTitle";
import "./styles.css";

type AlertContainerProps = {
	/**
	 * Visual style and semantic meaning.
	 * - `success`: green — operation completed.
	 * - `danger`: red — error or destructive action.
	 * - `warning`: yellow — caution required.
	 * - `info`: blue — informational message.
	 */
	scheme: "success" | "danger" | "warning" | "info";
} & HTMLAttributes<HTMLDivElement>;

const AlertContainerContext = createContext({} as AlertContainerProps);

/** @internal Accesses the schema and HTML props of the enclosing `AlertContainer`. */
function useAlertContainer(): AlertContainerProps {
	return useContext(AlertContainerContext);
}

/**
 * AlertContainer — root wrapper for the Alert component set. Provides schema context to child components.
 *
 * Automatically detects whether an `AlertTitle` is present among children and adjusts layout:
 * centered when no title, left-aligned when a title is present.
 *
 * @param props.scheme - Visual style variant. Required.
 * @param props.children - Alert sub-components: `AlertIcon`, `AlertContent`, `AlertTitle`, `AlertDescription`.
 *
 * **...Other valid HTML properties for `<div>`**
 *
 * @returns AlertContainer JSX element.
 *
 * @example
 * ```tsx
 * // Inline alert — no title, centered layout
 * <AlertContainer scheme="success">
 *   <AlertIcon />
 *   <AlertContent>Your subscription has been activated.</AlertContent>
 * </AlertContainer>
 *
 * // Full alert with title and description — left-aligned layout
 * <AlertContainer scheme="danger">
 *   <AlertIcon />
 *   <AlertContent>
 *     <AlertTitle>Payment failed</AlertTitle>
 *     <AlertDescription>Please check your card details and try again.</AlertDescription>
 *   </AlertContent>
 * </AlertContainer>
 * ```
 */

function AlertContainer(props: AlertContainerProps): JSX.Element {
	const { scheme, children, className: baseClassName, ...rest } = props;

	const hasAlertTitle = (children: ReactNode): boolean => {
		let found = false;
		const searchForAlertTitle = (nodes: ReactNode) => {
			if (Array.isArray(nodes)) {
				nodes.forEach(searchForAlertTitle);
			} else if (nodes && typeof nodes === "object" && "type" in nodes) {
				if (nodes.type === AlertTitle) {
					found = true;
				} else if (
					nodes.props &&
					typeof nodes.props === "object" &&
					nodes.props !== null &&
					"children" in nodes.props
				) {
					// biome-ignore lint/suspicious/noExplicitAny: intentional
					searchForAlertTitle((nodes.props as any).children);
				}
			}
		};
		searchForAlertTitle(children);
		return found;
	};

	const shouldAlignCenter = !hasAlertTitle(children);
	const finalClassName = shouldAlignCenter
		? "nonExistsAlertTitle"
		: "existsAlertTitle";

	const className = `arkynAlertContainer ${scheme} ${finalClassName} ${baseClassName}`;

	return (
		<AlertContainerContext.Provider value={props}>
			<div className={className.trim()} {...rest}>
				{children}
			</div>
		</AlertContainerContext.Provider>
	);
}

export { AlertContainer, useAlertContainer };

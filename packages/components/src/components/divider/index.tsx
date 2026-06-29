import type { HTMLAttributes } from "react";
import "./styles.css";

type DividerProps = HTMLAttributes<HTMLDivElement> & {
	/**
	 * Divider orientation.
	 * @default "horizontal"
	 */
	orientation?: "horizontal" | "vertical";
};

/**
 * Divider — visually separates content sections.
 *
 * @param props.orientation - Line direction (`horizontal` | `vertical`). Default: "horizontal"
 *
 * **...Other valid HTML properties for `<div>`**
 *
 * @returns Divider JSX element.
 *
 * @example
 * ```tsx
 * // Between sections
 * <h2>Section 1</h2>
 * <Divider />
 * <h2>Section 2</h2>
 *
 * // Vertical (e.g. between sidebar and content)
 * <Divider orientation="vertical" />
 * ```
 */

function Divider(props: DividerProps) {
	const {
		className: baseClassName,
		orientation = "horizontal",
		...rest
	} = props;

	const className = `arkynDivider ${orientation} ${baseClassName}`;

	return <div className={className.trim()} {...rest} />;
}

export { Divider };

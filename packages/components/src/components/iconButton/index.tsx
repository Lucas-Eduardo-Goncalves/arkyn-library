import { Loader2, type LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

import "./styles.css";

type IconButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	"children" | "aria-label"
> & {
	/** Lucide icon component rendered inside the button. Required. */
	icon: LucideIcon;
	/** Accessible label for screen readers. Required. */
	"aria-label": string;
	/** Shows a spinner and disables the button during async operations. @default false */
	isLoading?: boolean;
	/**
	 * Button size.
	 * @default "md"
	 */
	size?: "xs" | "sm" | "md" | "lg";
	/**
	 * Visual style variant.
	 * - `solid`: filled background.
	 * - `outline`: bordered, transparent background.
	 * - `ghost`: no border, subtle hover.
	 * - `invisible`: no visual styling.
	 * @default "solid"
	 */
	variant?: "solid" | "outline" | "ghost" | "invisible";
	/**
	 * Color scheme applied to the button.
	 * @default "primary"
	 */
	scheme?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
};

/**
 * IconButton — compact button that renders a single icon without a text label.
 *
 * Always requires `aria-label` for accessibility.
 *
 * @param props.icon - Lucide icon component to render. Required.
 * @param props["aria-label"] - Accessible label for screen readers. Required.
 * @param props.isLoading - Shows a spinner and disables the button. Default: false
 * @param props.size - Button size (`xs` | `sm` | `md` | `lg`). Default: "md"
 * @param props.variant - Visual style variant. Default: "solid"
 * @param props.scheme - Color scheme. Default: "primary"
 *
 * **...Other valid HTML properties for `<button>` (children not supported)**
 *
 * @returns IconButton JSX element.
 *
 * @example
 * ```tsx
 * <IconButton icon={Plus} aria-label="Add item" />
 *
 * <IconButton icon={Trash2} aria-label="Delete" scheme="danger" variant="outline" />
 *
 * <IconButton icon={Save} aria-label="Saving" isLoading />
 *
 * <IconButton icon={MoreVertical} aria-label="More options" size="sm" />
 * ```
 */

function IconButton(props: IconButtonProps) {
	const {
		isLoading = false,
		scheme = "primary",
		variant = "solid",
		size = "md",
		icon: Icon,
		disabled,
		className: baseClassName = "",
		...rest
	} = props;

	const iconSize = { xs: 12, sm: 16, md: 20, lg: 24 };
	const loading = isLoading ? "loadingTrue" : "loadingFalse";
	const className = `arkynIconButton ${variant} ${scheme} ${size} ${loading} ${baseClassName}`;

	return (
		<button
			disabled={disabled || isLoading}
			className={className.trim()}
			{...rest}
		>
			<div className="arkynIconButtonSpinner">
				<Loader2 size={iconSize[size]} strokeWidth={2.5} />
			</div>

			<div className="arkynIconButtonContent">
				<Icon size={iconSize[size]} strokeWidth={2.5} />
			</div>
		</button>
	);
}

export { IconButton };

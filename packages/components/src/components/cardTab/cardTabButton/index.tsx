import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";

import { useCardTab } from "../cardTabContext";
import "./styles.css";

type CardTabButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	"children" | "value" | "type"
> & {
	/** Content displayed inside the tab button. */
	children: ReactNode;
	/** Unique identifier for this tab; matched against the container's active value. */
	value: string;
};

/**
 * CardTabButton — individual tab button inside a `CardTabContainer`.
 *
 * Reads active state and disabled state from `CardTabContainer` context.
 * The button's own `disabled` prop is ORed with the container's `disabled`.
 *
 * @param props.children - Tab label content. Required.
 * @param props.value - Tab identifier. Required.
 * @param props.disabled - Disables this tab individually (container can also disable all tabs).
 *
 * **...Other valid HTML `<button>` properties except `type`**
 *
 * @returns CardTabButton JSX element.
 *
 * @example
 * ```tsx
 * <CardTabContainer defaultValue="details" onChange={setTab}>
 *   <CardTabButton value="details">Details</CardTabButton>
 *   <CardTabButton value="history">History</CardTabButton>
 *   <CardTabButton value="settings" disabled>Settings</CardTabButton>
 * </CardTabContainer>
 * ```
 */

function CardTabButton(props: CardTabButtonProps) {
	const {
		children,
		disabled: rawDisabled = false,
		className: baseClassName = "",
		onClick,
		value,
		...rest
	} = props;

	const { disabled, currentTab, changeCurrentTab } = useCardTab();

	const isDisabled = disabled || rawDisabled;

	const disabledClass = isDisabled ? "isDisabled" : "";
	const activeClass = currentTab === value && value ? "isActive" : "";
	const className = `arkynCardTabButton ${disabledClass} ${activeClass} ${baseClassName}`;

	function handleClick(event: MouseEvent<HTMLButtonElement>) {
		changeCurrentTab(value);
		onClick?.(event);
	}

	return (
		<button
			onClick={handleClick}
			className={className.trim()}
			{...rest}
			disabled={isDisabled}
			type="button"
		>
			{children}
		</button>
	);
}

export { CardTabButton };

import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";

import { useTab } from "../tabContext";
import "./styles.css";

type TabButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	"children" | "value" | "type"
> & {
	/** Content displayed inside the tab button. */
	children: ReactNode;
	/** Unique identifier for this tab; matched against the container's active value. */
	value: string;
};

/**
 * TabButton — individual tab button inside a `TabContainer`.
 *
 * Reads active state and disabled state from `TabContainer` context.
 * The button's own `disabled` prop is ORed with the container's `disabled`.
 *
 * @param props.children - Tab label content. Required.
 * @param props.value - Tab identifier. Required.
 * @param props.disabled - Disables this tab individually (container can also disable all tabs).
 *
 * **...Other valid HTML `<button>` properties except `type`**
 *
 * @returns TabButton JSX element.
 *
 * @example
 * ```tsx
 * <TabContainer defaultValue="overview" onChange={setTab}>
 *   <TabButton value="overview">Overview</TabButton>
 *   <TabButton value="activity">Activity</TabButton>
 *   <TabButton value="settings" disabled>Settings</TabButton>
 * </TabContainer>
 * ```
 */

function TabButton(props: TabButtonProps) {
	const {
		children,
		disabled: rawDisabled = false,
		className: baseClassName = "",
		onClick,
		value,
		...rest
	} = props;

	const { disabled, currentTab, changeCurrentTab } = useTab();

	const isDisabled = disabled || rawDisabled;

	const disabledClass = isDisabled ? "isDisabled" : "";
	const activeClass = currentTab === value && value ? "isActive" : "";
	const className = `arkynTabButton ${disabledClass} ${activeClass} ${baseClassName}`;

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

export { TabButton };

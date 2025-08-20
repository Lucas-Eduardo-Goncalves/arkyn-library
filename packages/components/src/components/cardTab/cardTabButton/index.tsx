import { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";

import { useCardTab } from "../cardTabContext";
import "./styles.css";

type CardTabButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "value" | "type"
> & {
  children: ReactNode;
  value: string;
};

/**
 * CardTabButton component - used as interactive buttons within a CardTabContainer for tab navigation
 *
 * @param props - CardTabButton component properties
 * @param props.children - Content to display inside the tab button (required)
 * @param props.value - Unique identifier for the tab button (required)
 * @param props.disabled - Whether the button is disabled. Can be overridden by CardTabContainer's disabled state
 *
 * **...Other valid HTML button properties except children, value, and type**
 *
 * @returns CardTabButton JSX element
 *
 * @example
 * ```tsx
 * // Basic tab buttons within CardTabContainer
 * <CardTabContainer>
 *   <CardTabButton value="home">Home</CardTabButton>
 *   <CardTabButton value="about">About</CardTabButton>
 *   <CardTabButton value="contact">Contact</CardTabButton>
 * </CardTabContainer>
 * ```
 *
 * @example
 * ```tsx
 * // Tab button with click handler
 * <CardTabContainer onChange={(value) => console.log('Tab changed:', value)}>
 *   <CardTabButton
 *     value="profile"
 *     onClick={() => console.log('Profile tab clicked')}
 *   >
 *     Profile
 *   </CardTabButton>
 *   <CardTabButton value="settings">Settings</CardTabButton>
 * </CardTabContainer>
 * ```
 *
 * @example
 * ```tsx
 * // Disabled tab button
 * <CardTabContainer>
 *   <CardTabButton value="available">Available</CardTabButton>
 *   <CardTabButton value="coming-soon" disabled>
 *     Coming Soon
 *   </CardTabButton>
 * </CardTabContainer>
 * ```
 *
 * @example
 * ```tsx
 * // Tab buttons with custom styling and default value
 * <CardTabContainer defaultValue="dashboard">
 *   <CardTabButton
 *     value="dashboard"
 *     className="custom-tab"
 *     aria-label="Dashboard tab"
 *   >
 *     Dashboard
 *   </CardTabButton>
 *   <CardTabButton value="analytics">Analytics</CardTabButton>
 *   <CardTabButton value="reports">Reports</CardTabButton>
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
    onClick && onClick(event);
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

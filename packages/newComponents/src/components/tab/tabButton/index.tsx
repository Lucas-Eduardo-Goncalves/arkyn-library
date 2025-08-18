import { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";

import { useTabContext } from "../tabContext";
import "./styles.css";

type TabButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "value" | "type"
> & {
  children: ReactNode;
  value: string;
};

/**
 * TabButton component - used as interactive buttons within a TabContainer for tab navigation
 *
 * @param props - TabButton component properties
 * @param props.children - Content to display inside the tab button (required)
 * @param props.value - Unique identifier for the tab button (required)
 * @param props.disabled - Whether the button is disabled. Can be overridden by TabContainer's disabled state
 *
 * **...Other valid HTML button properties except children, value, and type**
 *
 * @returns TabButton JSX element
 *
 * @example
 * ```tsx
 * // Basic tab buttons within TabContainer
 * <TabContainer>
 *   <TabButton value="home">Home</TabButton>
 *   <TabButton value="about">About</TabButton>
 *   <TabButton value="contact">Contact</TabButton>
 * </TabContainer>
 * ```
 *
 * @example
 * ```tsx
 * // Tab button with click handler
 * <TabContainer onChange={(value) => console.log('Tab changed:', value)}>
 *   <TabButton
 *     value="profile"
 *     onClick={() => console.log('Profile tab clicked')}
 *   >
 *     Profile
 *   </TabButton>
 *   <TabButton value="settings">Settings</TabButton>
 * </TabContainer>
 * ```
 *
 * @example
 * ```tsx
 * // Disabled tab button
 * <TabContainer>
 *   <TabButton value="available">Available</TabButton>
 *   <TabButton value="coming-soon" disabled>
 *     Coming Soon
 *   </TabButton>
 * </TabContainer>
 * ```
 *
 * @example
 * ```tsx
 * // Tab buttons with custom styling and default value
 * <TabContainer defaultValue="dashboard">
 *   <TabButton
 *     value="dashboard"
 *     className="custom-tab"
 *     aria-label="Dashboard tab"
 *   >
 *     Dashboard
 *   </TabButton>
 *   <TabButton value="analytics">Analytics</TabButton>
 *   <TabButton value="reports">Reports</TabButton>
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

  const { disabled, currentTab, changeCurrentTab } = useTabContext();

  const isDisabled = disabled || rawDisabled;

  const disabledClass = isDisabled ? "isDisabled" : "";
  const activeClass = currentTab === value && value ? "isActive" : "";
  const className = `arkynTabButton ${disabledClass} ${activeClass} ${baseClassName}`;

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

export { TabButton };

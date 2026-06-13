import { HTMLAttributes, ReactNode, useState } from "react";

import { TabProvider } from "../tabContext";
import "./styles.css";

type TabContainerProps = Omit<
  HTMLAttributes<HTMLElement>,
  "onChange" | "children" | "ref" | "onClick"
> & {
  /** `TabButton` components to render as tabs. Required. */
  children: ReactNode;
  /** Disables all tab buttons at once. @default false */
  disabled?: boolean;
  /** Initially selected tab value. */
  defaultValue?: string;
  /** Callback fired when the active tab changes, receiving the new value. */
  onChange?: (index: string) => void;
};

/**
 * TabContainer — wrapper that manages active state for a group of `TabButton` components.
 *
 * Renders as a `<nav>` element. Provides context consumed by each `TabButton`.
 *
 * @param props.children - `TabButton` elements. Required.
 * @param props.defaultValue - Initially selected tab value.
 * @param props.disabled - Disables all buttons. Default: false
 * @param props.onChange - Called with the new value whenever the active tab changes.
 *
 * **...Other valid HTML `<nav>` properties**
 *
 * @returns TabContainer JSX element.
 *
 * @example
 * ```tsx
 * <TabContainer defaultValue="overview" onChange={setActiveTab}>
 *   <TabButton value="overview">Overview</TabButton>
 *   <TabButton value="analytics">Analytics</TabButton>
 *   <TabButton value="settings">Settings</TabButton>
 * </TabContainer>
 *
 * {activeTab === 'overview' && <OverviewPanel />}
 * {activeTab === 'analytics' && <AnalyticsPanel />}
 * ```
 */

function TabContainer(props: TabContainerProps) {
  const {
    children,
    onChange,
    defaultValue,
    disabled = false,
    className: baseClassName,
    ...rest
  } = props;

  const [currentTab, setCurrentTab] = useState(defaultValue || "");

  const className = `arkynTabContainer ${baseClassName || ""}`;

  function changeCurrentTab(value: string) {
    setCurrentTab(value);
    if (onChange) onChange(value);
  }

  return (
    <TabProvider
      disabled={disabled}
      currentTab={currentTab}
      changeCurrentTab={changeCurrentTab}
    >
      <nav className={className.trim()} {...rest}>
        {children}
      </nav>
    </TabProvider>
  );
}

export { TabContainer };

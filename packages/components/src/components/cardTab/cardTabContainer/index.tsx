import { HTMLAttributes, ReactNode, useState } from "react";

import { CardTabProvider } from "../cardTabContext";
import "./styles.css";

type CardTabContainerProps = Omit<
  HTMLAttributes<HTMLElement>,
  "onClick" | "children" | "ref" | "onChange"
> & {
  /** `CardTabButton` components to render as tabs. Required. */
  children: ReactNode;
  /** Disables all tab buttons at once. @default false */
  disabled?: boolean;
  /** Initially selected tab value. */
  defaultValue?: string;
  /** Callback fired when the active tab changes, receiving the new value. */
  onChange?: (index: string) => void;
};

/**
 * CardTabContainer — wrapper that manages active state for a group of `CardTabButton` components.
 *
 * Renders as a `<nav>` element. Provides context consumed by each `CardTabButton`.
 *
 * @param props.children - `CardTabButton` elements. Required.
 * @param props.defaultValue - Initially selected tab value.
 * @param props.disabled - Disables all buttons. Default: false
 * @param props.onChange - Called with the new value whenever the active tab changes.
 *
 * **...Other valid HTML `<nav>` properties**
 *
 * @returns CardTabContainer JSX element.
 *
 * @example
 * ```tsx
 * <CardTabContainer defaultValue="overview" onChange={setActiveTab}>
 *   <CardTabButton value="overview">Overview</CardTabButton>
 *   <CardTabButton value="analytics">Analytics</CardTabButton>
 *   <CardTabButton value="settings">Settings</CardTabButton>
 * </CardTabContainer>
 *
 * {activeTab === 'overview' && <OverviewPanel />}
 * {activeTab === 'analytics' && <AnalyticsPanel />}
 * ```
 */

function CardTabContainer(props: CardTabContainerProps) {
  const {
    children,
    onChange,
    defaultValue,
    disabled = false,
    className: baseClassName,
    ...rest
  } = props;

  const [currentTab, setCurrentTab] = useState(defaultValue || "");

  const className = `arkynCardTabContainer ${baseClassName || ""}`;

  function changeCurrentTab(value: string) {
    setCurrentTab(value);
    if (onChange) onChange(value);
  }

  return (
    <CardTabProvider
      disabled={disabled}
      currentTab={currentTab}
      changeCurrentTab={changeCurrentTab}
    >
      <nav className={className.trim()} {...rest}>
        {children}
      </nav>
    </CardTabProvider>
  );
}

export { CardTabContainer };

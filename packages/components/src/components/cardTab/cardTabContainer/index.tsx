import { HTMLAttributes, ReactNode, useState } from "react";

import { TabProvider } from "../cardTabContext";
import "./styles.css";

type CardTabContainerProps = Omit<
  HTMLAttributes<HTMLElement>,
  "onClick" | "children" | "ref" | "onChange"
> & {
  children: ReactNode;
  disabled?: boolean;
  defaultValue?: string;
  onChange?: (index: string) => void;
};

/**
 * CardTabContainer component - used as a wrapper for CardTabButton components to create tabbed navigation
 *
 * @param props - CardTabContainer component properties
 * @param props.children - CardTabButton components and other content (required)
 * @param props.disabled - Whether all tab buttons are disabled. Default: false
 * @param props.defaultValue - Initial tab value to be selected
 * @param props.onChange - Callback function called when tab changes, receives the tab value
 *
 * **...Other valid HTML nav properties except onClick, children, and ref**
 *
 * @returns CardTabContainer JSX element
 *
 * @example
 * ```tsx
 * // Basic tab container
 * <CardTabContainer>
 *   <CardTabButton value="home">Home</CardTabButton>
 *   <CardTabButton value="about">About</CardTabButton>
 *   <CardTabButton value="contact">Contact</CardTabButton>
 * </CardTabContainer>
 * ```
 *
 * @example
 * ```tsx
 * // Tab container with default value and change handler
 * <CardTabContainer
 *   defaultValue="dashboard"
 *   onChange={(value) => console.log('Active tab:', value)}
 * >
 *   <CardTabButton value="dashboard">Dashboard</CardTabButton>
 *   <CardTabButton value="analytics">Analytics</CardTabButton>
 *   <CardTabButton value="settings">Settings</CardTabButton>
 * </CardTabContainer>
 * ```
 *
 * @example
 * ```tsx
 * // Disabled all tabs
 * <CardTabContainer disabled>
 *   <CardTabButton value="tab1">Tab 1</CardTabButton>
 *   <CardTabButton value="tab2">Tab 2</CardTabButton>
 * </CardTabContainer>
 * ```
 *
 * @example
 * ```tsx
 * // Tab container with custom styling and state management
 * function MyTabs() {
 *   const [activeTab, setActiveTab] = useState('profile');
 *
 *   return (
 *     <div>
 *       <CardTabContainer
 *         defaultValue={activeTab}
 *         onChange={setActiveTab}
 *         className="custom-tabs"
 *         role="tablist"
 *       >
 *         <CardTabButton value="profile">Profile</CardTabButton>
 *         <CardTabButton value="account">Account</CardTabButton>
 *         <CardTabButton value="notifications">Notifications</CardTabButton>
 *       </CardTabContainer>
 *
 *       {activeTab === 'profile' && <ProfileContent />}
 *       {activeTab === 'account' && <AccountContent />}
 *       {activeTab === 'notifications' && <NotificationsContent />}
 *     </div>
 *   );
 * }
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

export { CardTabContainer };

import { HTMLAttributes, ReactNode, useState } from "react";

import { TabProvider } from "../tabContext";
import "./styles.css";

type TabContainerProps = Omit<
  HTMLAttributes<HTMLElement>,
  "onClick" | "children" | "ref"
> & {
  children: ReactNode;
  disabled?: boolean;
  defaultValue?: string;
  onChange?: (index: string) => void;
};

/**
 * TabContainer component - used as a wrapper for TabButton components to create tabbed navigation
 *
 * @param props - TabContainer component properties
 * @param props.children - TabButton components and other content (required)
 * @param props.disabled - Whether all tab buttons are disabled. Default: false
 * @param props.defaultValue - Initial tab value to be selected
 * @param props.onChange - Callback function called when tab changes, receives the tab value
 *
 * **...Other valid HTML nav properties except onClick, children, and ref**
 *
 * @returns TabContainer JSX element
 *
 * @example
 * ```tsx
 * // Basic tab container
 * <TabContainer>
 *   <TabButton value="home">Home</TabButton>
 *   <TabButton value="about">About</TabButton>
 *   <TabButton value="contact">Contact</TabButton>
 * </TabContainer>
 * ```
 *
 * @example
 * ```tsx
 * // Tab container with default value and change handler
 * <TabContainer
 *   defaultValue="dashboard"
 *   onChange={(value) => console.log('Active tab:', value)}
 * >
 *   <TabButton value="dashboard">Dashboard</TabButton>
 *   <TabButton value="analytics">Analytics</TabButton>
 *   <TabButton value="settings">Settings</TabButton>
 * </TabContainer>
 * ```
 *
 * @example
 * ```tsx
 * // Disabled all tabs
 * <TabContainer disabled>
 *   <TabButton value="tab1">Tab 1</TabButton>
 *   <TabButton value="tab2">Tab 2</TabButton>
 * </TabContainer>
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
 *       <TabContainer
 *         defaultValue={activeTab}
 *         onChange={setActiveTab}
 *         className="custom-tabs"
 *         role="tablist"
 *       >
 *         <TabButton value="profile">Profile</TabButton>
 *         <TabButton value="account">Account</TabButton>
 *         <TabButton value="notifications">Notifications</TabButton>
 *       </TabContainer>
 *
 *       {activeTab === 'profile' && <ProfileContent />}
 *       {activeTab === 'account' && <AccountContent />}
 *       {activeTab === 'notifications' && <NotificationsContent />}
 *     </div>
 *   );
 * }
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

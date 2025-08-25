import { createContext, ReactNode, useState } from "react";

type DrawerContextProps<T = any> = {
  drawerIsOpen(key: string): boolean;
  drawerData(key: string): T;
  openDrawer(key: string, data?: T): void;
  closeDrawer(key: string): void;
};

type OpenedDrawers = {
  key: string;
  data?: any;
}[];

type DrawerProviderProps = {
  children: ReactNode;
  enableDrawerAutomation?: boolean;
};

const drawerContext = createContext({} as DrawerContextProps);

/**
 * DrawerProvider component - provides drawer context for managing multiple drawers state and data
 *
 * @param props - DrawerProvider component properties
 * @param props.children - React elements that will have access to the drawer context
 * @param props.enableDrawerAutomation - Optional flag to enable drawer automation features
 *
 * @returns DrawerProvider JSX element that wraps children with drawer context
 *
 * @example
 * ```tsx
 * // Basic drawer provider setup
 * function App() {
 *   return (
 *     <DrawerProvider>
 *       <NavigationDrawer />
 *       <FilterDrawer />
 *       <SettingsDrawer />
 *       <MainContent />
 *     </DrawerProvider>
 *   );
 * }
 *
 * // Drawer provider with automation enabled
 * function AppWithAutomation() {
 *   return (
 *     <DrawerProvider enableDrawerAutomation={true}>
 *       <Dashboard />
 *       <SidePanel />
 *       <NotificationDrawer />
 *     </DrawerProvider>
 *   );
 * }
 *
 * // Using with multiple drawers
 * function MultiDrawerApp() {
 *   return (
 *     <DrawerProvider>
 *       <Header />
 *       <NavigationDrawer key="navigation" />
 *       <FilterDrawer key="filters" />
 *       <CartDrawer key="shopping-cart" />
 *       <MainContent />
 *     </DrawerProvider>
 *   );
 * }
 *
 * // Component using drawer context
 * function DrawerController() {
 *   const { openDrawer, closeDrawer } = useDrawer();
 *
 *   const handleOpenNavigation = () => {
 *     openDrawer('navigation', { section: 'main-menu' });
 *   };
 *
 *   const handleOpenFilters = () => {
 *     openDrawer('filters', { category: 'electronics', priceRange: [0, 1000] });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleOpenNavigation}>
 *         Open Navigation
 *       </button>
 *       <button onClick={handleOpenFilters}>
 *         Open Filters
 *       </button>
 *     </div>
 *   );
 * }
 *
 * // Drawer component consuming context
 * function NavigationDrawer() {
 *   const { drawerIsOpen, drawerData, closeDrawer } = useDrawer('navigation');
 *
 *   if (!drawerIsOpen) return null;
 *
 *   return (
 *     <Drawer position="left" onClose={() => closeDrawer('navigation')}>
 *       <h2>Navigation</h2>
 *       <p>Current section: {drawerData?.section}</p>
 *       <nav>
 *         <a href="/home">Home</a>
 *         <a href="/products">Products</a>
 *         <a href="/about">About</a>
 *       </nav>
 *     </Drawer>
 *   );
 * }
 * ```
 */

function DrawerProvider(args: DrawerProviderProps) {
  const { children = false } = args;
  const [openedDrawers, setOpenedDrawers] = useState<OpenedDrawers>([]);

  function drawerIsOpen(key: string) {
    return !!openedDrawers.some((drawer) => drawer.key === key);
  }

  function drawerData(key: string) {
    return openedDrawers.find((drawer) => drawer.key === key)?.data;
  }

  function openDrawer(key: string, data?: any) {
    const alreadyExist = drawerIsOpen(key);
    if (alreadyExist) {
      setOpenedDrawers((old) => {
        const filtered = old.filter((drawer) => drawer.key !== key);
        return [...filtered, { key, data }];
      });
    } else setOpenedDrawers([...openedDrawers, { key, data }]);
  }

  function closeDrawer(key: string) {
    setOpenedDrawers(openedDrawers.filter((drawer) => drawer.key !== key));
  }

  return (
    <drawerContext.Provider
      value={{ drawerIsOpen, drawerData, openDrawer, closeDrawer }}
    >
      {children}
    </drawerContext.Provider>
  );
}

export { drawerContext, DrawerProvider, type DrawerContextProps };

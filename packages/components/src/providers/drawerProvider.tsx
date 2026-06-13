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
 * DrawerProvider — context provider that manages open/close state and data for named drawers.
 *
 * Wrap your app (or a subtree) with this once. Any component in the tree can then call
 * `useDrawer(key)` to open, close, or read data for a specific drawer.
 *
 * @param props.children - Components that will have access to drawer context.
 *
 * @returns DrawerProvider JSX element.
 *
 * @example
 * ```tsx
 * // In your root layout
 * <DrawerProvider>
 *   <App />
 * </DrawerProvider>
 *
 * // Opening a drawer from anywhere in the tree
 * const { openDrawer } = useDrawer();
 * openDrawer('filters', { category: 'electronics' });
 *
 * // Consuming in the drawer component
 * const { drawerIsOpen, drawerData, closeDrawer } = useDrawer<{ category: string }>('filters');
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

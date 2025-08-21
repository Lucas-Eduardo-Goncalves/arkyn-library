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

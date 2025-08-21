import { useContext } from "react";
import { drawerContext, DrawerContextProps } from "../providers/drawerProvider";

type OpenDrawerProps<T = any> = (data?: T) => void;

function useDrawer<T = any>(): DrawerContextProps<T>;
function useDrawer<T = any>(
  key: string
): {
  drawerIsOpen: boolean;
  drawerData: T;
  openDrawer: OpenDrawerProps<T>;
  closeDrawer: () => void;
};

function useDrawer(key?: string) {
  const contextData = useContext(drawerContext);

  if (Object.entries(contextData).length === 0) {
    throw new Error("useDrawer must be used within a Provider");
  }

  if (key) {
    const {
      drawerData: contextDrawerData,
      drawerIsOpen: contextDrawerIsOpen,
      openDrawer: contextOpenDrawer,
      closeDrawer: contextCloseDrawer,
    } = contextData;

    const drawerIsOpen = contextDrawerIsOpen(key);
    const drawerData = contextDrawerData(key);

    const openDrawer: OpenDrawerProps = (data) => contextOpenDrawer(key, data);
    const closeDrawer = () => contextCloseDrawer(key);

    return { drawerIsOpen, drawerData, openDrawer, closeDrawer };
  } else {
    return contextData;
  }
}

export { useDrawer };

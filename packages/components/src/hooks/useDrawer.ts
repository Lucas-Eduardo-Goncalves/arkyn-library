import { useContext } from "react";
import { drawerContext, DrawerContextProps } from "../providers/drawerProvider";

type OpenDrawerProps<T = any> = (data?: T) => void;

/**
 * useDrawer hook - provides access to drawer context for managing drawer state and data
 *
 * @param key - Optional drawer identifier key. When provided, returns functions for a specific drawer
 *
 * @returns When called without key: Complete drawer context with all drawer management functions
 * @returns When called with key: Object containing drawer-specific functions:
 * - `drawerIsOpen`: Boolean indicating if the specific drawer is open
 * - `drawerData`: Data associated with the specific drawer
 * - `openDrawer`: Function to open the specific drawer with optional data
 * - `closeDrawer`: Function to close the specific drawer
 *
 * @example
 * ```tsx
 * // Basic usage - access to full drawer context
 * function DrawerManager() {
 *   const drawerContext = useDrawer();
 *
 *   return (
 *     <div>
 *       <button onClick={() => drawerContext.openDrawer('navigation', { section: 'main' })}>
 *         Open Navigation
 *       </button>
 *       <button onClick={() => drawerContext.openDrawer('filters', { category: 'electronics' })}>
 *         Open Filters
 *       </button>
 *     </div>
 *   );
 * }
 *
 * // Usage with specific drawer key
 * function NavigationDrawer() {
 *   const { drawerIsOpen, drawerData, openDrawer, closeDrawer } = useDrawer('navigation');
 *
 *   return (
 *     <Drawer isOpen={drawerIsOpen} onClose={closeDrawer} position="left">
 *       <h2>Navigation</h2>
 *       <p>Current section: {drawerData?.section}</p>
 *       <button onClick={closeDrawer}>Close</button>
 *     </Drawer>
 *   );
 * }
 *
 * // Usage with typed data
 * interface FilterData {
 *   category: string;
 *   priceRange: [number, number];
 *   brands: string[];
 * }
 *
 * function FilterDrawer() {
 *   const { drawerIsOpen, drawerData, closeDrawer } = useDrawer<FilterData>('filters');
 *
 *   return (
 *     <Drawer isOpen={drawerIsOpen} onClose={closeDrawer} position="right">
 *       <h2>Filters</h2>
 *       <p>Category: {drawerData?.category}</p>
 *       <p>Price: ${drawerData?.priceRange?.[0]} - ${drawerData?.priceRange?.[1]}</p>
 *       <p>Brands: {drawerData?.brands?.join(', ')}</p>
 *     </Drawer>
 *   );
 * }
 *
 * // Usage with DrawerProvider
 * function App() {
 *   return (
 *     <DrawerProvider>
 *       <NavigationDrawer />
 *       <FilterDrawer />
 *       <DrawerManager />
 *     </DrawerProvider>
 *   );
 * }
 * ```
 */

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

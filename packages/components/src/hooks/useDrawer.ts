import { useContext } from "react";
import {
	type DrawerContextProps,
	drawerContext,
} from "../providers/drawerProvider";

type OpenDrawerProps<T = any> = (data?: T) => void;

/**
 * useDrawer — accesses the nearest `DrawerProvider` context.
 *
 * Two call signatures:
 * - **Without `key`** — returns the raw context object (manage any drawer by name).
 * - **With `key`** — returns a scoped object bound to one named drawer.
 *
 * @param key - Drawer identifier registered in `DrawerProvider`.
 *
 * @returns Without key: full `DrawerContextProps`. With key: `{ drawerIsOpen, drawerData, openDrawer, closeDrawer }`.
 *
 * @throws If called outside a `DrawerProvider`.
 *
 * @example
 * ```tsx
 * // Scoped to one drawer — the most common pattern
 * const { drawerIsOpen, drawerData, openDrawer, closeDrawer } = useDrawer<{ section: string }>('navigation');
 *
 * openDrawer({ section: 'products' });
 * ```
 *
 * @example
 * ```tsx
 * // Full context — useful when triggering multiple different drawers from one place
 * const { openDrawer } = useDrawer();
 *
 * openDrawer('navigation', { section: 'main' });
 * openDrawer('filters', { category: 'electronics' });
 * ```
 */

function useDrawer<T = any>(): DrawerContextProps<T>;
function useDrawer<T = any>(
	key: string,
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

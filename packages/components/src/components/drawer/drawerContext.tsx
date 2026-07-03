import { createContext, type ReactNode, useContext, useMemo } from "react";

type DrawerContextProps = {
	makeInvisible: () => void;
};

type DrawerProviderProps = {
	children: ReactNode;
	makeInvisible: () => void;
};

const drawerContext = createContext({} as DrawerContextProps);

function DrawerProvider(props: DrawerProviderProps) {
	const value = useMemo(
		() => ({ makeInvisible: props.makeInvisible }),
		[props.makeInvisible],
	);

	return (
		<drawerContext.Provider value={value}>
			{props.children}
		</drawerContext.Provider>
	);
}

function useDrawer() {
	return useContext(drawerContext);
}

export { DrawerProvider, useDrawer };

import { createContext, type ReactNode, useContext } from "react";

type DrawerContextProps = {
	makeInvisible: () => void;
};

type DrawerProviderProps = {
	children: ReactNode;
	makeInvisible: () => void;
};

const drawerContext = createContext({} as DrawerContextProps);

function DrawerProvider(props: DrawerProviderProps) {
	return (
		<drawerContext.Provider value={{ makeInvisible: props.makeInvisible }}>
			{props.children}
		</drawerContext.Provider>
	);
}

function useDrawer() {
	return useContext(drawerContext);
}

export { DrawerProvider, useDrawer };

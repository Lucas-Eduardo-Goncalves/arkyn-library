import { createContext, type ReactNode, useContext } from "react";

type TabContextProps = {
	disabled: boolean;
	currentTab: string;
	changeCurrentTab: (tab: string) => void;
};

type TabProviderProps = {
	children: ReactNode;
	disabled: boolean;
	currentTab: string;
	changeCurrentTab: (tab: string) => void;
};

const TabContext = createContext({} as TabContextProps);

function useTab() {
	return useContext(TabContext);
}

function TabProvider(props: TabProviderProps) {
	return (
		<TabContext.Provider value={props}>{props.children}</TabContext.Provider>
	);
}

export { TabProvider, useTab };

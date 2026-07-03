import { createContext, type ReactNode, useContext, useMemo } from "react";

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
	const { disabled, currentTab, changeCurrentTab } = props;

	const value = useMemo(
		() => ({ disabled, currentTab, changeCurrentTab }),
		[disabled, currentTab, changeCurrentTab],
	);

	return (
		<TabContext.Provider value={value}>{props.children}</TabContext.Provider>
	);
}

export { TabProvider, useTab };

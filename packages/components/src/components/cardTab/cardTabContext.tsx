import { createContext, type ReactNode, useContext, useMemo } from "react";

type CardTabContextProps = {
	disabled: boolean;
	currentTab: string;
	changeCurrentTab: (tab: string) => void;
};

type CardTabProviderProps = {
	children: ReactNode;
	disabled: boolean;
	currentTab: string;
	changeCurrentTab: (tab: string) => void;
};

const CardTabContext = createContext({} as CardTabContextProps);

function useCardTab() {
	return useContext(CardTabContext);
}

function CardTabProvider(props: CardTabProviderProps) {
	const { disabled, currentTab, changeCurrentTab } = props;

	const value = useMemo(
		() => ({ disabled, currentTab, changeCurrentTab }),
		[disabled, currentTab, changeCurrentTab],
	);

	return (
		<CardTabContext.Provider value={value}>
			{props.children}
		</CardTabContext.Provider>
	);
}

export { CardTabProvider, useCardTab };

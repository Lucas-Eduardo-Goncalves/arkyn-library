import { createContext, type ReactNode, useContext } from "react";

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
	return (
		<CardTabContext.Provider value={props}>
			{props.children}
		</CardTabContext.Provider>
	);
}

export { CardTabProvider, useCardTab };

import { createContext, ReactNode, useContext } from "react";

type CardTabContextProps = {
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

const CardTabContext = createContext({} as CardTabContextProps);

function useCardTab() {
  return useContext(CardTabContext);
}

function TabProvider(props: TabProviderProps) {
  return (
    <CardTabContext.Provider value={props}>
      {props.children}
    </CardTabContext.Provider>
  );
}

export { TabProvider, useCardTab };

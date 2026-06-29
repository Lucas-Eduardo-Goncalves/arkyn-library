import { createContext, type ReactNode, useContext } from "react";

type ModalContextProps = {
	makeInvisible: () => void;
};

type ModalProviderProps = {
	children: ReactNode;
	makeInvisible: () => void;
};

const modalContext = createContext({} as ModalContextProps);

function ModalProvider(props: ModalProviderProps) {
	return (
		<modalContext.Provider value={{ makeInvisible: props.makeInvisible }}>
			{props.children}
		</modalContext.Provider>
	);
}

function useModal() {
	return useContext(modalContext);
}

export { ModalProvider, useModal };

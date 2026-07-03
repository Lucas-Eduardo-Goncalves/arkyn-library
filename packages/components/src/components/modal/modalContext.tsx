import { createContext, type ReactNode, useContext, useMemo } from "react";

type ModalContextProps = {
	makeInvisible: () => void;
};

type ModalProviderProps = {
	children: ReactNode;
	makeInvisible: () => void;
};

const modalContext = createContext({} as ModalContextProps);

function ModalProvider(props: ModalProviderProps) {
	const value = useMemo(
		() => ({ makeInvisible: props.makeInvisible }),
		[props.makeInvisible],
	);

	return (
		<modalContext.Provider value={value}>
			{props.children}
		</modalContext.Provider>
	);
}

function useModal() {
	return useContext(modalContext);
}

export { ModalProvider, useModal };

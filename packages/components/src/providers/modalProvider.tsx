import { createContext, type ReactNode, useState } from "react";

type ModalContextProps<T = any> = {
	modalIsOpen(key: string): boolean;
	modalData(key: string): T;
	openModal(key: string, data?: T): void;
	closeModal(key: string): void;
	closeAll(): void;
};

type OpenedModals = {
	key: string;
	data?: any;
}[];

type ModalProviderProps = {
	children: ReactNode;
	enableModalAutomation?: boolean;
};

const modalContext = createContext({} as ModalContextProps);

/**
 * ModalProvider — context provider that manages open/close state and data for named modals.
 *
 * Wrap your app (or a subtree) with this once. Any component in the tree can then call
 * `useModal(key)` to open, close, or read data for a specific modal. `closeAll()` is also
 * available (used by `useAutomation` to close all modals after a successful form action).
 *
 * @param props.children - Components that will have access to modal context.
 *
 * @returns ModalProvider JSX element.
 *
 * @example
 * ```tsx
 * // In your root layout
 * <ModalProvider>
 *   <App />
 * </ModalProvider>
 *
 * // Opening a modal from anywhere in the tree
 * const { openModal } = useModal();
 * openModal('confirm-delete', { id: user.id });
 *
 * // Consuming in the modal component
 * const { modalIsOpen, modalData, closeModal } = useModal<{ id: number }>('confirm-delete');
 * ```
 */

function ModalProvider(args: ModalProviderProps) {
	const { children = false } = args;
	const [openedModals, setOpenedModals] = useState<OpenedModals>([]);

	function modalIsOpen(key: string) {
		return !!openedModals.some((modal) => modal.key === key);
	}

	function modalData(key: string) {
		return openedModals.find((modal) => modal.key === key)?.data;
	}

	function openModal(key: string, data?: any) {
		const alreadyExist = modalIsOpen(key);
		if (alreadyExist) {
			setOpenedModals((old) => {
				const filtered = old.filter((modal) => modal.key !== key);
				return [...filtered, { key, data }];
			});
		} else setOpenedModals([...openedModals, { key, data }]);
	}

	function closeModal(key: string) {
		setOpenedModals(openedModals.filter((modal) => modal.key !== key));
	}

	function closeAll() {
		setOpenedModals([]);
	}

	return (
		<modalContext.Provider
			value={{ modalIsOpen, modalData, openModal, closeModal, closeAll }}
		>
			{children}
		</modalContext.Provider>
	);
}

export { type ModalContextProps, ModalProvider, modalContext };

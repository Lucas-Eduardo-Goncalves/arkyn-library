import {
	createContext,
	type ReactNode,
	useCallback,
	useMemo,
	useState,
} from "react";

// biome-ignore lint/suspicious/noExplicitAny: intentional
type ModalContextProps<T = any> = {
	modalIsOpen(key: string): boolean;
	modalData(key: string): T;
	openModal(key: string, data?: T): void;
	closeModal(key: string): void;
	closeAll(): void;
};

type OpenedModals = {
	key: string;
	// biome-ignore lint/suspicious/noExplicitAny: intentional
	data?: any;
}[];

type ModalProviderProps = {
	children: ReactNode;
	enableModalAutomation?: boolean;
};

const modalContext = createContext({} as ModalContextProps);

/**
 * ModalProvider, context provider that manages open/close state and data for named modals.
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

	const modalIsOpen = useCallback(
		(key: string) => openedModals.some((modal) => modal.key === key),
		[openedModals],
	);

	const modalData = useCallback(
		(key: string) => openedModals.find((modal) => modal.key === key)?.data,
		[openedModals],
	);

	const openModal = useCallback(
		// biome-ignore lint/suspicious/noExplicitAny: intentional
		(key: string, data?: any) => {
			setOpenedModals((old) => {
				const filtered = old.filter((modal) => modal.key !== key);
				return [...filtered, { key, data }];
			});
		},
		[],
	);

	const closeModal = useCallback((key: string) => {
		setOpenedModals((old) => old.filter((modal) => modal.key !== key));
	}, []);

	const closeAll = useCallback(() => {
		setOpenedModals([]);
	}, []);

	const value = useMemo(
		() => ({ modalIsOpen, modalData, openModal, closeModal, closeAll }),
		[modalIsOpen, modalData, openModal, closeModal, closeAll],
	);

	return (
		<modalContext.Provider value={value}>{children}</modalContext.Provider>
	);
}

export { type ModalContextProps, ModalProvider, modalContext };

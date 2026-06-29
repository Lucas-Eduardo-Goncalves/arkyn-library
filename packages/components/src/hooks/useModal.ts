import { useContext } from "react";
import {
	type ModalContextProps,
	modalContext,
} from "../providers/modalProvider";

type OpenModalProps<T = any> = (data?: T) => void;

/**
 * useModal — accesses the nearest `ModalProvider` context.
 *
 * Two call signatures:
 * - **Without `key`** — returns the raw context object (manage any modal by name).
 * - **With `key`** — returns a scoped object bound to one named modal.
 *
 * @param key - Modal identifier registered in `ModalProvider`.
 *
 * @returns Without key: full `ModalContextProps`. With key: `{ modalIsOpen, modalData, openModal, closeModal }`.
 *
 * @throws If called outside a `ModalProvider`.
 *
 * @example
 * ```tsx
 * // Scoped to one modal — the most common pattern
 * const { modalIsOpen, modalData, openModal, closeModal } = useModal<{ id: number }>('confirm-delete');
 *
 * openModal({ id: user.id });
 * ```
 *
 * @example
 * ```tsx
 * // Full context — useful when triggering multiple different modals from one place
 * const { openModal } = useModal();
 *
 * openModal('confirm-delete', { id: user.id });
 * openModal('user-details', { id: user.id });
 * ```
 */

function useModal<T = any>(): ModalContextProps<T>;
function useModal<T = any>(
	key: string,
): {
	modalIsOpen: boolean;
	modalData: T;
	openModal: OpenModalProps<T>;
	closeModal: () => void;
};

function useModal(key?: string) {
	const contextData = useContext(modalContext);

	if (Object.entries(contextData).length === 0) {
		throw new Error("useModal must be used within a Provider");
	}

	if (key) {
		const {
			modalData: contextModalData,
			modalIsOpen: contextModalIsOpen,
			openModal: contextOpenModal,
			closeModal: contextCloseModal,
		} = contextData;

		const modalIsOpen = contextModalIsOpen(key);
		const modalData = contextModalData(key);

		const openModal: OpenModalProps = (data) => contextOpenModal(key, data);
		const closeModal = () => contextCloseModal(key);

		return { modalIsOpen, modalData, openModal, closeModal };
	} else {
		return contextData;
	}
}

export { useModal };

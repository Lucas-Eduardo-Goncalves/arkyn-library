import { useContext } from "react";
import { modalContext, ModalContextProps } from "../providers/modalProvider";

type OpenModalProps<T = any> = (data?: T) => void;

/**
 * useModal hook - provides access to modal context for managing modal state and data
 *
 * @param key - Optional modal identifier key. When provided, returns functions for a specific modal
 *
 * @returns When called without key: Complete modal context with all modal management functions
 * @returns When called with key: Object containing modal-specific functions:
 * - `modalIsOpen`: Boolean indicating if the specific modal is open
 * - `modalData`: Data associated with the specific modal
 * - `openModal`: Function to open the specific modal with optional data
 * - `closeModal`: Function to close the specific modal
 *
 * @example
 * ```tsx
 * // Basic usage - access to full modal context
 * function ModalManager() {
 *   const modalContext = useModal();
 *
 *   return (
 *     <div>
 *       <button onClick={() => modalContext.openModal('user-details', { id: 1 })}>
 *         Open User Modal
 *       </button>
 *     </div>
 *   );
 * }
 *
 * // Usage with specific modal key
 * function UserModal() {
 *   const { modalIsOpen, modalData, openModal, closeModal } = useModal('user-details');
 *
 *   return (
 *     <Modal isOpen={modalIsOpen} onClose={closeModal}>
 *       <h2>User Details</h2>
 *       <p>User ID: {modalData?.id}</p>
 *       <button onClick={closeModal}>Close</button>
 *     </Modal>
 *   );
 * }
 *
 * // Usage with typed data
 * interface UserData {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * function UserProfileModal() {
 *   const { modalIsOpen, modalData, closeModal } = useModal<UserData>('user-profile');
 *
 *   return (
 *     <Modal isOpen={modalIsOpen} onClose={closeModal}>
 *       <h2>{modalData?.name}</h2>
 *       <p>Email: {modalData?.email}</p>
 *     </Modal>
 *   );
 * }
 *
 * // Usage with ModalProvider
 * function App() {
 *   return (
 *     <ModalProvider>
 *       <UserModal />
 *       <UserProfileModal />
 *       <ModalManager />
 *     </ModalProvider>
 *   );
 * }
 * ```
 */

function useModal<T = any>(): ModalContextProps<T>;
function useModal<T = any>(
  key: string
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

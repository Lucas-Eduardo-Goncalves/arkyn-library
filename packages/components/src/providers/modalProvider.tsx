import { createContext, ReactNode, useState } from "react";

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
 * ModalProvider component - provides modal context for managing multiple modals state and data
 *
 * @param props - ModalProvider component properties
 * @param props.children - React elements that will have access to the modal context
 * @param props.enableModalAutomation - Optional flag to enable modal automation features
 *
 * @returns ModalProvider JSX element that wraps children with modal context
 *
 * @example
 * ```tsx
 * // Basic modal provider setup
 * function App() {
 *   return (
 *     <ModalProvider>
 *       <UserModal />
 *       <ConfirmModal />
 *       <ImagePreviewModal />
 *       <MainContent />
 *     </ModalProvider>
 *   );
 * }
 *
 * // Modal provider with automation enabled
 * function AppWithAutomation() {
 *   return (
 *     <ModalProvider enableModalAutomation={true}>
 *       <Dashboard />
 *       <SettingsModal />
 *       <NotificationModal />
 *     </ModalProvider>
 *   );
 * }
 *
 * // Using with multiple modals
 * function MultiModalApp() {
 *   return (
 *     <ModalProvider>
 *       <Header />
 *       <Modal key="user-profile" />
 *       <Modal key="edit-settings" />
 *       <Modal key="confirm-delete" />
 *       <MainContent />
 *     </ModalProvider>
 *   );
 * }
 *
 * // Component using modal context
 * function ModalTrigger() {
 *   const { openModal, closeAll } = useModal();
 *
 *   const handleOpenUserModal = () => {
 *     openModal('user-details', { userId: 123, mode: 'edit' });
 *   };
 *
 *   const handleCloseAllModals = () => {
 *     closeAll();
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleOpenUserModal}>
 *         Open User Modal
 *       </button>
 *       <button onClick={handleCloseAllModals}>
 *         Close All Modals
 *       </button>
 *     </div>
 *   );
 * }
 *
 * // Modal component consuming context
 * function UserDetailsModal() {
 *   const { modalIsOpen, modalData, closeModal } = useModal('user-details');
 *
 *   if (!modalIsOpen) return null;
 *
 *   return (
 *     <Modal onClose={() => closeModal('user-details')}>
 *       <h2>User Details</h2>
 *       <p>User ID: {modalData?.userId}</p>
 *       <p>Mode: {modalData?.mode}</p>
 *     </Modal>
 *   );
 * }
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

export { modalContext, ModalProvider, type ModalContextProps };

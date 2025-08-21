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

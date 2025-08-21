import { useContext } from "react";
import { modalContext, ModalContextProps } from "../providers/modalProvider";

type OpenModalProps<T = any> = (data?: T) => void;

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

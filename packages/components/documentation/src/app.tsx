import { ModalContainer } from "../../src/components/modal/modalContainer";
import { ModalHeader } from "../../src/components/modal/modalHeader";
import { useModal } from "../../src/hooks/useModal";

function App() {
  const { openModal, modalIsOpen, closeModal, modalData } =
    useModal("edit-tags");

  const list = [
    { id: "1", name: "tag1" },
    { id: "2", name: "tag2" },
  ];

  return (
    <div>
      <div>
        {list.map((tag) => (
          <div key={tag.id}>
            <button onClick={() => openModal(tag)}>editar</button>
            {tag.name}
          </div>
        ))}
      </div>

      <ModalContainer isVisible={modalIsOpen} makeInvisible={closeModal}>
        <ModalHeader>oi</ModalHeader>
        {modalData?.id}
        {modalData?.name}
      </ModalContainer>
    </div>
  );
}

export { App };

import { Button, ModalContainer, ModalFooter, ModalHeader } from "@components";
import { useState } from "react";

import { Box } from "../ui/box";
import { Row } from "../ui/row";

function ModalExamples() {
  const [modal, setModal] = useState(false);

  return (
    <Box title="Modal">
      <Row>
        <Button onClick={() => setModal(true)}>Open modal</Button>

        <ModalContainer isVisible={modal} makeInvisible={() => setModal(false)}>
          <ModalHeader>Modal</ModalHeader>
          <p style={{ padding: "16px", minWidth: "400px" }}>
            This is the content of the right drawer.
          </p>
          <ModalFooter>
            <Button scheme="danger" onClick={() => setModal(false)}>
              Close modal
            </Button>
          </ModalFooter>
        </ModalContainer>
      </Row>
    </Box>
  );
}

export { ModalExamples };

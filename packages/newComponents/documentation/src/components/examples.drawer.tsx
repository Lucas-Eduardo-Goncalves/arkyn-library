import { Button, DrawerContainer, DrawerHeader } from "@components";

import { useState } from "react";
import { Box } from "../ui/box";
import { Row } from "../ui/row";

function DrawerExamples() {
  const [leftDrawer, setLeftDrawer] = useState(false);
  const [rightDrawer, setRightDrawer] = useState(false);

  return (
    <Box title="Drawer">
      <Row>
        <Button onClick={() => setLeftDrawer(true)}>Open left drawer</Button>
        <Button onClick={() => setRightDrawer(true)}>Open right drawer</Button>

        <DrawerContainer
          isVisible={leftDrawer}
          makeInvisible={() => setLeftDrawer(false)}
          orientation="left"
        >
          <DrawerHeader>Left drawer</DrawerHeader>
          <p style={{ padding: "16px" }}>
            This is the content of the left drawer.
          </p>
        </DrawerContainer>

        <DrawerContainer
          isVisible={rightDrawer}
          makeInvisible={() => setRightDrawer(false)}
          orientation="right"
        >
          <DrawerHeader>Right drawer</DrawerHeader>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
          <p style={{ padding: "16px" }}>
            This is the content of the right drawer.
          </p>
        </DrawerContainer>
      </Row>
    </Box>
  );
}

export { DrawerExamples };

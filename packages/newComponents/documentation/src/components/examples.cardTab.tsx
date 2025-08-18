import { CardTabButton, CardTabContainer } from "@components";
import { Box } from "../ui/box";

function CardTabExamples() {
  return (
    <Box title="CardTab">
      <CardTabContainer>
        <CardTabButton value="item-1">Item 1</CardTabButton>
        <CardTabButton value="item-2">Item 2</CardTabButton>
        <CardTabButton value="item-3">Item 3</CardTabButton>
      </CardTabContainer>

      <CardTabContainer defaultValue="item-3">
        <CardTabButton value="item-1">Item 1</CardTabButton>
        <CardTabButton value="item-2">Item 2</CardTabButton>
        <CardTabButton value="item-3">Item 3</CardTabButton>
      </CardTabContainer>

      <CardTabContainer disabled>
        <CardTabButton value="item-1">Item 1</CardTabButton>
        <CardTabButton value="item-2">Item 2</CardTabButton>
        <CardTabButton value="item-3">Item 3</CardTabButton>
      </CardTabContainer>

      <CardTabContainer>
        <CardTabButton value="item-1">Item 1</CardTabButton>
        <CardTabButton value="item-2">Item 2</CardTabButton>
        <CardTabButton value="item-3" disabled>
          Item 3
        </CardTabButton>
      </CardTabContainer>
    </Box>
  );
}

export { CardTabExamples };

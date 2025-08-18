import { TabButton, TabContainer } from "@components";
import { Box } from "../ui/box";

function TabExamples() {
  return (
    <Box title="Tab">
      <TabContainer>
        <TabButton value="item-1">Item 1</TabButton>
        <TabButton value="item-2">Item 2</TabButton>
        <TabButton value="item-3">Item 3</TabButton>
      </TabContainer>

      <TabContainer defaultValue="item-3">
        <TabButton value="item-1">Item 1</TabButton>
        <TabButton value="item-2">Item 2</TabButton>
        <TabButton value="item-3">Item 3</TabButton>
      </TabContainer>

      <TabContainer disabled>
        <TabButton value="item-1">Item 1</TabButton>
        <TabButton value="item-2">Item 2</TabButton>
        <TabButton value="item-3">Item 3</TabButton>
      </TabContainer>

      <TabContainer>
        <TabButton value="item-1">Item 1</TabButton>
        <TabButton value="item-2">Item 2</TabButton>
        <TabButton value="item-3" disabled>
          Item 3
        </TabButton>
      </TabContainer>
    </Box>
  );
}

export { TabExamples };

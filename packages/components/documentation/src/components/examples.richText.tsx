import { RichText } from "@components";

import { Box } from "../ui/box";

function RichTextExamples() {
  return (
    <Box title="RichText">
      <RichText name="default" label="Test:" showAsterisk />
    </Box>
  );
}

export { RichTextExamples };

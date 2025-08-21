import { ImageUpload } from "@components";

import { Box } from "../ui/box";

function ImageUploadExamples() {
  return (
    <Box title="ImageUpload">
      <ImageUpload
        label="Teste:"
        showAsterisk
        name="image"
        action="/api/upload"
      />

      <ImageUpload
        name="image-disabled"
        action="/api/upload"
        defaultValue="https://images.unsplash.com/photo-1611651338412-8403fa6e3599?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        disabled
      />
    </Box>
  );
}

export { ImageUploadExamples };

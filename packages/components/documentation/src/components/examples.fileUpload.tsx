import { FileUpload } from "@components";

import { Box } from "../ui/box";

function FileUploadExamples() {
  return (
    <Box title="FileUpload">
      <FileUpload
        label="Teste:"
        showAsterisk
        name="file"
        action="/api/upload"
      />

      <FileUpload name="file-disabled" action="/api/upload" disabled />
    </Box>
  );
}

export { FileUploadExamples };

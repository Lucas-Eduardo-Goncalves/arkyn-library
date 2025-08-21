import { AudioUpload } from "@components";

import { Box } from "../ui/box";

const DEFAULT_VALUE = `http://codeskulptor-demos.commondatastorage.googleapis.com/pang/paza-moduless.mp3`;

function AudioUploadExamples() {
  return (
    <Box title="AudioUpload">
      <AudioUpload
        label="Teste:"
        showAsterisk
        name="audio"
        action="/api/upload"
      />

      <AudioUpload
        name="audio-disabled"
        action="/api/upload"
        defaultValue={DEFAULT_VALUE}
        disabled
      />
    </Box>
  );
}

export { AudioUploadExamples };

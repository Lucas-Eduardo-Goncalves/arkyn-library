import { AudioPlayer } from "@components";

import { Box } from "../ui/box";

const AUDIO_PLAYER_SRC = `http://codeskulptor-demos.commondatastorage.googleapis.com/pang/paza-moduless.mp3`;

function AudioPlayerExamples() {
  return (
    <Box title="AudioPlayer">
      <AudioPlayer src={AUDIO_PLAYER_SRC} />
      <AudioPlayer src={AUDIO_PLAYER_SRC} disabled />
    </Box>
  );
}

export { AudioPlayerExamples };

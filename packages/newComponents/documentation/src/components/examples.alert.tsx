import {
  AlertContainer,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@components";

import { Box } from "../ui/box";

function AlertExamples() {
  return (
    <Box title="Alert">
      <AlertContainer schema="danger">
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Alert title</AlertTitle>
          <AlertDescription>This is an alert description</AlertDescription>
        </AlertContent>
      </AlertContainer>

      <AlertContainer schema="info">
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Info title</AlertTitle>
          <AlertDescription>This is an info description</AlertDescription>
        </AlertContent>
      </AlertContainer>

      <AlertContainer schema="success">
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Success title</AlertTitle>
          <AlertDescription>This is a success description</AlertDescription>
        </AlertContent>
      </AlertContainer>

      <AlertContainer schema="warning">
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Warning title</AlertTitle>
          <AlertDescription>This is a warning description</AlertDescription>
        </AlertContent>
      </AlertContainer>
    </Box>
  );
}

export { AlertExamples };

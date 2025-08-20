import { Button } from "@components";
import { Star } from "lucide-react";

import { Box } from "../ui/box";
import { Row } from "../ui/row";

function ButtonExamples() {
  return (
    <Box title="Button">
      <Row>
        <Button>variant - ghost (default)</Button>
        <Button variant="outline">variant - outline</Button>
        <Button variant="ghost">variant - ghost</Button>
        <Button variant="invisible">variant - invisible</Button>
      </Row>

      <Row>
        <Button size="xs">size - xs</Button>
        <Button size="sm">size - sm</Button>
        <Button>size - md (default)</Button>
        <Button size="lg">size - lg</Button>
      </Row>

      <Row>
        <Button>scheme - primary (default)</Button>
        <Button scheme="danger">scheme - danger</Button>
        <Button scheme="info">scheme - info</Button>
        <Button scheme="success">scheme - success</Button>
        <Button scheme="warning">scheme - warning</Button>
      </Row>

      <Row>
        <Button leftIcon={Star}>leftIcon</Button>
        <Button rightIcon={Star}>rightIcon</Button>
      </Row>
      <Row>
        <Button isLoading size="xs">
          isLoading
        </Button>
        <Button isLoading size="sm">
          isLoading
        </Button>
        <Button isLoading>isLoading</Button>
        <Button isLoading size="lg">
          isLoading
        </Button>
      </Row>
      <Row>
        <Button isLoading size="xs" loadingText="Loading...">
          isLoading
        </Button>
        <Button isLoading size="sm" loadingText="Loading...">
          isLoading
        </Button>
        <Button isLoading loadingText="Loading...">
          isLoading
        </Button>
        <Button isLoading size="lg" loadingText="Loading...">
          isLoading
        </Button>
      </Row>
    </Box>
  );
}

export { ButtonExamples };

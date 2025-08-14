import { Badge } from "@components";
import { Box } from "../ui/box";
import { Row } from "../ui/row";
import { Star } from "lucide-react";

function BadgeExamples() {
  return (
    <Box title="Badge Examples">
      <Row>
        <Badge>variant - ghost (default)</Badge>
        <Badge variant="outline">variant - outline</Badge>
        <Badge variant="solid">variant - solid</Badge>
      </Row>

      <Row>
        <Badge>size - md (default)</Badge>
        <Badge size="lg">size - lg</Badge>
      </Row>

      <Row>
        <Badge>scheme - primary (default)</Badge>
        <Badge scheme="secondary">scheme - secondary</Badge>
        <Badge scheme="danger">scheme - danger</Badge>
        <Badge scheme="info">scheme - info</Badge>
        <Badge scheme="success">scheme - success</Badge>
        <Badge scheme="warning">scheme - warning</Badge>
      </Row>

      <Row>
        <Badge leftIcon={Star}>leftIcon</Badge>
        <Badge rightIcon={Star}>rightIcon</Badge>
      </Row>
    </Box>
  );
}

export { BadgeExamples };

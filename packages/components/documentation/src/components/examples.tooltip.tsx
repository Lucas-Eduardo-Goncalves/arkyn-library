import { Badge, Tooltip } from "@components";
import { Box } from "../ui/box";
import { Row } from "../ui/row";

function TooltipExamples() {
  return (
    <Box title="Tooltip">
      <Row>
        <Tooltip text="Tooltip on top" orientation="top">
          <Badge>top</Badge>
        </Tooltip>

        <Tooltip text="Tooltip on right" orientation="right">
          <Badge>right</Badge>
        </Tooltip>

        <Tooltip text="Tooltip on bottom" orientation="bottom">
          <Badge>bottom</Badge>
        </Tooltip>

        <Tooltip text="Tooltip on left" orientation="left">
          <Badge>left</Badge>
        </Tooltip>
      </Row>

      <Row>
        <Tooltip text="Tooltip on left" orientation="left">
          <Badge>oh no... the tooltip does not fit on the left</Badge>
        </Tooltip>
      </Row>

      <Row>
        <Tooltip text="md tooltip" orientation="top" size="md">
          <Badge>size - md </Badge>
        </Tooltip>

        <Tooltip text="lg tooltip" orientation="top">
          <Badge>size - lg (default)</Badge>
        </Tooltip>
      </Row>
    </Box>
  );
}

export { TooltipExamples };

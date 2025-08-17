import { Tooltip } from "@components";
import { Box } from "../ui/box";
import { Row } from "../ui/row";

function TooltipExamples() {
  return (
    <Box title="Tooltip">
      <Row>
        <Tooltip text="Tooltip on top" orientation="top">
          <p>top</p>
        </Tooltip>

        <Tooltip text="Tooltip on right" orientation="right">
          <p>right</p>
        </Tooltip>

        <Tooltip text="Tooltip on bottom" orientation="bottom">
          <p>bottom</p>
        </Tooltip>

        <Tooltip text="Tooltip on left" orientation="left">
          <p>left</p>
        </Tooltip>
      </Row>

      <Row>
        <Tooltip text="Tooltip on left" orientation="left">
          <p>oh no... the tooltip does not fit on the left</p>
        </Tooltip>
      </Row>

      <Row>
        <Tooltip text="md tooltip" orientation="top" size="md">
          <p>size - md </p>
        </Tooltip>

        <Tooltip text="lg tooltip" orientation="top">
          <p>size - lg (default)</p>
        </Tooltip>
      </Row>
    </Box>
  );
}

export { TooltipExamples };

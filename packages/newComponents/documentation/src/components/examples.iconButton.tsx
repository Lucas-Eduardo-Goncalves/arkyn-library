import { IconButton } from "@components";
import { Star } from "lucide-react";
import { Box } from "../ui/box";
import { Row } from "../ui/row";

function IconButtonExamples() {
  return (
    <Box title="IconButton Examples">
      <Row>
        <IconButton aria-label="test" icon={Star} />
        <IconButton
          aria-label="variant - outline"
          icon={Star}
          variant="outline"
        />
        <IconButton aria-label="variant - ghost" icon={Star} variant="ghost" />
        <IconButton
          aria-label="variant - invisible"
          icon={Star}
          variant="invisible"
        />
      </Row>

      <Row>
        <IconButton size="xs" aria-label="size - xs" icon={Star} />
        <IconButton size="sm" aria-label="size - sm" icon={Star} />
        <IconButton size="md" aria-label="size - md (default)" icon={Star} />
        <IconButton size="lg" aria-label="size - lg" icon={Star} />
      </Row>

      <Row>
        <IconButton aria-label="scheme - primary (default)" icon={Star} />
        <IconButton aria-label="scheme - danger" icon={Star} scheme="danger" />
        <IconButton aria-label="scheme - info" icon={Star} scheme="info" />
        <IconButton
          aria-label="scheme - success"
          icon={Star}
          scheme="success"
        />
        <IconButton
          aria-label="scheme - warning"
          icon={Star}
          scheme="warning"
        />
      </Row>

      <Row>
        <IconButton
          aria-label="isLoading - size xs"
          icon={Star}
          isLoading
          size="xs"
        />
        <IconButton
          aria-label="isLoading - size sm"
          icon={Star}
          isLoading
          size="sm"
        />
        <IconButton
          aria-label="isLoading - size md"
          icon={Star}
          isLoading
          size="md"
        />
        <IconButton
          aria-label="isLoading - size lg"
          icon={Star}
          isLoading
          size="lg"
        />
      </Row>
    </Box>
  );
}

export { IconButtonExamples };

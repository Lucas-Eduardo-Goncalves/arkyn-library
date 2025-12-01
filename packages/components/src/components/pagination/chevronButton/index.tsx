import { ChevronLeft, ChevronRight } from "lucide-react";
import "./styles.css";

type ChevronButtonProps = {
  orientation: "left" | "right";
  disabled: boolean;
  handlePageChange: () => void;
};

function ChevronButton(props: ChevronButtonProps) {
  const { orientation, handlePageChange, disabled } = props;
  const icon = { left: <ChevronLeft />, right: <ChevronRight /> };

  return (
    <button
      className="arkynChevronPageButton"
      disabled={disabled}
      onClick={handlePageChange}
    >
      {icon[orientation]}
    </button>
  );
}

export { ChevronButton };

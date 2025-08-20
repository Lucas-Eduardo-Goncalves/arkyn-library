import { Loader2 } from "lucide-react";
import "./styles.css";

type MultiSelectSpinnerProps = {
  iconSize: number;
  isLoading: boolean;
};

function MultiSelectSpinner(props: MultiSelectSpinnerProps) {
  const { iconSize, isLoading } = props;

  if (!isLoading) return <></>;
  return (
    <Loader2
      className="arkynMultiSelectSpinner"
      size={iconSize}
      strokeWidth={2.5}
    />
  );
}

export { MultiSelectSpinner };

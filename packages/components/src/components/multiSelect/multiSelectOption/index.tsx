import { Check } from "lucide-react";
import "./styles.css";

type MultiSelectOptionProps = {
  value: string;
  label: string;
  size: "md" | "lg";
  optionHasSelected: (value: string) => boolean;
  handleChangeValue: (value: string) => void;
};

function MultiSelectOption(props: MultiSelectOptionProps) {
  const { label, optionHasSelected, handleChangeValue, value, size } = props;

  const hasActive = optionHasSelected(value) ? "active" : "";
  const className = `arkynMultiSelectOption ${size} ${hasActive}`;

  return (
    <div onClick={() => handleChangeValue(value)} className={className}>
      {label} <Check />
    </div>
  );
}

export { MultiSelectOption };

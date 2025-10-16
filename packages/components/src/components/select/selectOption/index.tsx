import { Check } from "lucide-react";
import "./styles.css";

type SelectOptionProps = {
  value: string;
  label: string;
  size: "md" | "lg";
  optionHasSelected: (value: string) => boolean;
  handleChangeValue: (value: string) => void;
};

function SelectOption(props: SelectOptionProps) {
  const { label, optionHasSelected, handleChangeValue, value, size } = props;

  const hasActive = optionHasSelected(value) ? "active" : "";
  const className = `arkynSelectOption ${size} ${hasActive}`;

  return (
    <div onClick={() => handleChangeValue(value)} className={className}>
      {label} <Check />
    </div>
  );
}

export { SelectOption };

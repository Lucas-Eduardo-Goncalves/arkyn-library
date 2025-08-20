import { X } from "lucide-react";
import "./styles.css";

type MultiSelectMarkProps = {
  label: string;
  disabled: boolean;
  value: string;
  handleChangeValue: (value: string) => void;
};

function MultiSelectMark(props: MultiSelectMarkProps) {
  const { label, value, disabled, handleChangeValue } = props;

  return (
    <div className="arkynMultiSelectMark">
      {label}

      <button
        disabled={disabled}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleChangeValue(value);
        }}
      >
        <X />
      </button>
    </div>
  );
}

export { MultiSelectMark };

import { Check } from "lucide-react";
import "./styles.css";

type SelectOptionProps = {
	value: string;
	label: string;
	size: "md" | "lg";
	id?: string;
	isHighlighted?: boolean;
	optionHasSelected: (value: string) => boolean;
	handleChangeValue: (value: string) => void;
};

function SelectOption(props: SelectOptionProps) {
	const {
		label,
		optionHasSelected,
		handleChangeValue,
		value,
		size,
		id,
		isHighlighted = false,
	} = props;

	const isSelected = optionHasSelected(value);
	const hasActive = isSelected ? "active" : "";
	const highlighted = isHighlighted ? "highlighted" : "";
	const className = `arkynSelectOption ${size} ${hasActive} ${highlighted}`;

	return (
		<button
			type="button"
			id={id}
			role="option"
			aria-selected={isSelected}
			onClick={() => handleChangeValue(value)}
			className={className}
		>
			{label} <Check />
		</button>
	);
}

export { SelectOption };

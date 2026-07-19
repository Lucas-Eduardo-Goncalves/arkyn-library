import { ChevronDown } from "lucide-react";
import "./styles.css";

type DatePickerChevronProps = {
	isLoading: boolean;
	iconSize: number;
	disabled: boolean;
	readOnly: boolean;
	isFocused: boolean;
};

function DatePickerChevron(props: DatePickerChevronProps) {
	const { iconSize, isLoading, disabled, readOnly, isFocused } = props;

	const notAnimate = disabled || readOnly ? "notAnimate" : "";
	const focused = isFocused ? "focused" : "";

	const className = `arkynDatePickerChevron ${notAnimate} ${focused}`;

	if (isLoading) return null;
	return (
		<ChevronDown
			className={className}
			strokeWidth={2.5}
			style={{
				minWidth: iconSize,
				minHeight: iconSize,
				maxWidth: iconSize,
				maxHeight: iconSize,
			}}
		/>
	);
}

export { DatePickerChevron };

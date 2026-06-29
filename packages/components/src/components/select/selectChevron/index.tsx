import { ChevronDown } from "lucide-react";
import "./styles.css";

type SelectChevronProps = {
	isLoading: boolean;
	iconSize: number;
	disabled: boolean;
	readOnly: boolean;
	isFocused: boolean;
};

function SelectChevron(props: SelectChevronProps) {
	const { iconSize, isLoading, disabled, readOnly, isFocused } = props;

	const notAnimate = disabled || readOnly ? "notAnimate" : "";
	const focused = isFocused ? "focused" : "";

	const className = `arkynSelectChevron ${notAnimate} ${focused}`;

	if (isLoading) return <></>;
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

export { SelectChevron };

import { Loader2 } from "lucide-react";
import "./styles.css";

type DatePickerSpinnerProps = {
	iconSize: number;
	isLoading: boolean;
};

function DatePickerSpinner(props: DatePickerSpinnerProps) {
	const { iconSize, isLoading } = props;

	if (!isLoading) return null;
	return (
		<Loader2
			className="arkynDatePickerSpinner"
			size={iconSize}
			strokeWidth={2.5}
		/>
	);
}

export { DatePickerSpinner };

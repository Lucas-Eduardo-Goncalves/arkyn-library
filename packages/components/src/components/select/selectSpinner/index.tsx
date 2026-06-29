import { Loader2 } from "lucide-react";
import "./styles.css";

type SelectSpinnerProps = {
	iconSize: number;
	isLoading: boolean;
};

function SelectSpinner(props: SelectSpinnerProps) {
	const { iconSize, isLoading } = props;

	if (!isLoading) return <></>;
	return (
		<Loader2 className="arkynSelectSpinner" size={iconSize} strokeWidth={2.5} />
	);
}

export { SelectSpinner };

import "./styles.css";

type DatePickerOverlayProps = {
	isFocused: boolean;
	handleBlur: () => void;
};

function DatePickerOverlay(props: DatePickerOverlayProps) {
	const { isFocused, handleBlur } = props;
	if (!isFocused) return null;
	return <aside className="arkynDatePickerOverlay" onClick={handleBlur} />;
}

export { DatePickerOverlay };

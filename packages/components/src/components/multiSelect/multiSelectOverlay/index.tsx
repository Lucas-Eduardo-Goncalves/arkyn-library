import "./styles.css";

type MultiSelectOverlayProps = {
	isFocused: boolean;
	handleBlur: () => void;
};

function MultiSelectOverlay(props: MultiSelectOverlayProps) {
	const { isFocused, handleBlur } = props;
	if (!isFocused) return null;
	return <aside className="arkynMultiSelectOverlay" onClick={handleBlur} />;
}

export { MultiSelectOverlay };

import "./styles.css";

type SelectOverlayProps = {
	isFocused: boolean;
	handleBlur: () => void;
};

function SelectOverlay(props: SelectOverlayProps) {
	const { isFocused, handleBlur } = props;
	if (!isFocused) return null;
	return <aside className="arkynSelectOverlay" onClick={handleBlur} />;
}

export { SelectOverlay };

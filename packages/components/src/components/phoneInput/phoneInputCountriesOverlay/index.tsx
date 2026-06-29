import "./styles.css";

type PhoneInputCountriesOverlayProps = {
	isOpen: boolean;
	onClick: () => void;
};

function PhoneInputCountriesOverlay(props: PhoneInputCountriesOverlayProps) {
	const { isOpen, onClick } = props;
	if (!isOpen) return <></>;
	return (
		<aside className="arkynPhoneInputCountriesOverlay" onClick={onClick} />
	);
}

export { PhoneInputCountriesOverlay };

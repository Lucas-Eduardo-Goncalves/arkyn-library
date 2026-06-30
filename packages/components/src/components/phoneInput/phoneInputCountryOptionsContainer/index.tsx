import {
	type ChangeEvent,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { useScrollLock } from "../../../hooks/useScrollLock";
import "./styles.css";

type PhoneInputCountryOptionsContainerProps = {
	isOpen: boolean;
	children: ReactNode;
	search: string;
	placeholder: string;
	onSearch: (value: string) => void;
};

function PhoneInputCountryOptionsContainer(
	props: PhoneInputCountryOptionsContainerProps,
) {
	const { children, isOpen, onSearch, search, placeholder } = props;

	const containerRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState<"bottom" | "top">("bottom");

	function handleSearch(e: ChangeEvent<HTMLInputElement>) {
		onSearch(e.target.value);
	}

	useScrollLock(isOpen);

	useEffect(() => {
		if (!isOpen) return;

		const checkContainerPosition = () => {
			if (!containerRef.current) return;

			const parentElement = containerRef.current.parentElement;
			if (!parentElement) return;

			const parentRect = parentElement.getBoundingClientRect();
			const viewportHeight = window.innerHeight;

			const estimatedContainerHeight = 300;
			const spaceBelow = viewportHeight - parentRect.bottom;

			if (
				spaceBelow < estimatedContainerHeight &&
				parentRect.top > estimatedContainerHeight
			) {
				setPosition("top");
			} else {
				setPosition("bottom");
			}
		};

		checkContainerPosition();
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			className={`arkynPhoneInputCountryOptionsContainer ${position}`}
			ref={containerRef}
		>
			<input
				type="search"
				name="search-select"
				className="arkynPhoneInputCountryOptionsContainerSearchSelect"
				value={search}
				id="input-search"
				placeholder={placeholder}
				onChange={handleSearch}
			/>

			{children}
		</div>
	);
}

export { PhoneInputCountryOptionsContainer };

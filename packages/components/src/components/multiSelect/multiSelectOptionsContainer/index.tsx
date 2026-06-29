import { Search } from "lucide-react";
import {
	type ChangeEvent,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";

import { useScrollLock } from "../../../hooks/useScrollLock";
import { Input } from "../../input";

import "./styles.css";

type MultiSelectOptionsContainerProps = {
	isFocused: boolean;
	isSearchable: boolean;
	children: ReactNode;
	search: string;
	onSearch: (value: string) => void;
};

function MultiSelectOptionsContainer(props: MultiSelectOptionsContainerProps) {
	const { children, isFocused, isSearchable, search, onSearch } = props;

	const containerRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState<"bottom" | "top">("bottom");

	useScrollLock(isFocused);

	useEffect(() => {
		if (!isFocused) return;

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
	}, [isFocused]);

	function handleSearch(e: ChangeEvent<HTMLInputElement>) {
		if (!isSearchable) return;
		onSearch(e.target.value);
	}

	if (!isFocused) return <></>;

	return (
		<div
			ref={containerRef}
			className={`arkynMultiSelectOptionsContainer ${position}`}
		>
			{isSearchable && (
				<Input
					type="search"
					name="search-select"
					variant="underline"
					leftIcon={Search}
					value={search}
					onChange={handleSearch}
				/>
			)}

			{children}
		</div>
	);
}

export { MultiSelectOptionsContainer };

import { type ReactNode, useEffect, useRef, useState } from "react";

import { useScrollLock } from "../../../hooks/useScrollLock";

import "./styles.css";

type DatePickerCalendarContainerProps = {
	isFocused: boolean;
	children: ReactNode;
};

function DatePickerCalendarContainer(props: DatePickerCalendarContainerProps) {
	const { children, isFocused } = props;

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

			const estimatedContainerHeight = 420;
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

	if (!isFocused) return null;

	return (
		<div
			ref={containerRef}
			className={`arkynDatePickerCalendarContainer ${position}`}
		>
			{children}
		</div>
	);
}

export { DatePickerCalendarContainer };

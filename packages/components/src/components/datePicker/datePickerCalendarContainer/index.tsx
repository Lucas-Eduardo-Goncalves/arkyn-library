import { type ReactNode, useEffect, useRef, useState } from "react";

import { useScrollLock } from "../../../hooks/useScrollLock";

import "./styles.css";

type DatePickerCalendarContainerProps = {
	id?: string;
	isFocused: boolean;
	children: ReactNode;
};

function DatePickerCalendarContainer(props: DatePickerCalendarContainerProps) {
	const { children, id, isFocused } = props;

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
			id={id}
			role="dialog"
			aria-modal="false"
			className={`arkynDatePickerCalendarContainer ${position}`}
		>
			{children}
		</div>
	);
}

export { DatePickerCalendarContainer };

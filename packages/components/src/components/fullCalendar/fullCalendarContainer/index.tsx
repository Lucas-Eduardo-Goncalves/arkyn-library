import type { ReactNode } from "react";
import "./styles.css";

type FullCalendarContainerProps = {
	children?: ReactNode;
};

function FullCalendarContainer({ children }: FullCalendarContainerProps) {
	return <div className="arkynFullCalendarContainer">{children}</div>;
}

export { FullCalendarContainer };

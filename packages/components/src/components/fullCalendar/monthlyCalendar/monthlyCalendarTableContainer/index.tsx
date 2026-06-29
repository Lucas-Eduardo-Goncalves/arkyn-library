import type { ReactNode } from "react";
import "./styles.css";

type MonthlyCalendarTableContainerProps = {
	children: ReactNode;
};

function MonthlyCalendarTableContainer({
	children,
}: MonthlyCalendarTableContainerProps) {
	return (
		<div className="arkynMonthlyCalendarTableContainer">
			<table>{children}</table>
		</div>
	);
}

export { MonthlyCalendarTableContainer };

import { useFullCalendar } from "../../_fullCalendarProvider";
import { MonthlyCalendarEvent } from "../monthlyCalendarEvent";
import "./styles.css";

type MonthlyCalendarTableTdProps = {
	day: number;
	month: number;
	year: number;
	dayOwner: "previous" | "current" | "next";
};

function MonthlyCalendarTableTd(props: MonthlyCalendarTableTdProps) {
	const { day, month, year, dayOwner } = props;
	const { blockedTimestamps, onClickDate } = useFullCalendar();

	function isToday() {
		const today = new Date();
		return (
			day === today.getDate() &&
			month === today.getMonth() &&
			year === today.getFullYear()
		);
	}

	function isBlocked() {
		const currentDate = new Date(year, month, day);

		return blockedTimestamps.some(
			(timestamp) =>
				currentDate >= timestamp.initialDate &&
				currentDate <= timestamp.endDate,
		);
	}

	function handleClick(event: React.MouseEvent) {
		event.stopPropagation();
		if (isBlocked()) return;

		if (onClickDate) {
			const date = new Date(year, month, day);
			onClickDate(date);
		}
	}

	return (
		<td
			className={`arkynMonthlyCalendarTableTd ${dayOwner} ${isBlocked() ? "blocked" : ""}`}
			onClick={handleClick}
		>
			<p className={isToday() ? "today" : ""}>{day}</p>
			<div className="arkynMonthlyCalendarEventContainer">
				<MonthlyCalendarEvent day={day} month={month} year={year} />
			</div>
		</td>
	);
}

export { MonthlyCalendarTableTd };

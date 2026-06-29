import { useCalendar } from "../_calendarProvider";
import "./styles.css";

type CalendarTableTdProps = {
	day: number;
	month: number;
	year: number;
	dayType: "checkedDay" | "middleDay" | "uncheckedDay";
	dayOwner: "previous" | "current" | "next";
};

function CalendarTableTd(props: CalendarTableTdProps) {
	const { day, month, year, dayOwner, dayType } = props;
	const { changeDay } = useCalendar();

	function isToday() {
		const today = new Date();
		return (
			day === today.getDate() &&
			month === today.getMonth() &&
			year === today.getFullYear()
		);
	}

	return (
		<td
			onClick={() => changeDay(day, month, year)}
			className={`arkynCalendarTableTd ${dayOwner} ${dayType} ${isToday() ? "today" : ""}`}
		>
			<div className="textGroup">
				<span />
				<p>{day}</p>
			</div>
		</td>
	);
}

export { CalendarTableTd };

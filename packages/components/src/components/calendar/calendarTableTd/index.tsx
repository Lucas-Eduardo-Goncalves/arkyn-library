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

	function handleSelectDay() {
		changeDay(day, month, year);
	}

	return (
		<td
			className={`arkynCalendarTableTd ${dayOwner} ${dayType} ${isToday() ? "today" : ""}`}
		>
			<button
				type="button"
				className="textGroup"
				aria-pressed={dayType === "checkedDay"}
				onClick={handleSelectDay}
			>
				<span />
				<p>{day}</p>
			</button>
		</td>
	);
}

export { CalendarTableTd };

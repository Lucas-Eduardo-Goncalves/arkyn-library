import { useFullCalendar } from "../../_fullCalendarProvider";
import { WeekCalendarEvent } from "../weekCalendarEvent";
import "./styles.css";

type WeekCalendarTableTdProps = {
	day: number;
	month: number;
	year: number;
	dayOwner: "previous" | "current" | "next";
	timeInMinutes: number;
};

function WeekCalendarTableTd(props: WeekCalendarTableTdProps) {
	const { day, month, year, dayOwner, timeInMinutes } = props;
	const { blockedTimestamps, onClickDate } = useFullCalendar();

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
			date.setHours(0, timeInMinutes, 0, 0);
			onClickDate(date);
		}
	}

	return (
		<td
			className={`arkynWeekCalendarTableTd ${dayOwner}  ${isBlocked() ? "blocked" : ""}`}
			data-day={day}
			data-time={timeInMinutes}
			onClick={handleClick}
		>
			<div className="arkynWeekCalendarTableTdContent">
				<WeekCalendarEvent
					day={day}
					month={month}
					year={year}
					timeInMinutes={timeInMinutes}
				/>
			</div>
		</td>
	);
}

export { WeekCalendarTableTd };

import { useFullCalendar } from "../../_fullCalendarProvider";
import { ViewService } from "../../_viewService";
import { DayCalendarEvent } from "../dayCalendarEvent";
import "./styles.css";

type DayCalendarRowProps = {
	hour: number;
	timeInMinutes: number;
};

function DayCalendarRow({ hour, timeInMinutes }: DayCalendarRowProps) {
	const viewService = new ViewService();
	const { blockedTimestamps, viewDate, onClickDate } = useFullCalendar();

	function isBlocked() {
		return blockedTimestamps.some(
			(timestamp) =>
				viewDate >= timestamp.initialDate && viewDate <= timestamp.endDate,
		);
	}

	function handleClick(event: React.MouseEvent) {
		event.stopPropagation();
		if (isBlocked()) return;

		if (onClickDate) {
			const date = new Date(viewDate);
			date.setHours(0, timeInMinutes, 0, 0);
			onClickDate(date);
		}
	}

	return (
		<div
			className={`arkynDayCalendarRow ${isBlocked() ? "blocked" : ""}`}
			data-time={timeInMinutes}
			onClick={handleClick}
		>
			<p>{viewService.formatHourLabel(hour)}</p>

			<div className="arkynDayCalendarRowContent">
				<DayCalendarEvent timeInMinutes={timeInMinutes} />
			</div>
		</div>
	);
}

export { DayCalendarRow, type DayCalendarRowProps };

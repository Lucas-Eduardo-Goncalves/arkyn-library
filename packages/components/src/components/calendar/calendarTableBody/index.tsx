import { useCalendar } from "../_calendarProvider";
import { CalendarTableTd } from "../calendarTableTd";
import "./styles.css";

function CalendarTableBody() {
	const calendar = useCalendar();

	return (
		<tbody className="arkynCalendarTableBody">
			{calendar.listMatrix.map((week, weekIndex) => (
				<tr key={weekIndex}>
					{week.map((props, dayIndex) => (
						<CalendarTableTd key={dayIndex} {...props} />
					))}
				</tr>
			))}
		</tbody>
	);
}

export { CalendarTableBody };

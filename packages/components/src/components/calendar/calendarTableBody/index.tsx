import { useCalendar } from "../_calendarProvider";
import { CalendarTableTd } from "../calendarTableTd";
import "./styles.css";

function CalendarTableBody() {
	const calendar = useCalendar();

	return (
		<tbody className="arkynCalendarTableBody">
			{calendar.listMatrix.map((week, weekIndex) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: week position is stable in monthly matrix
				<tr key={`week-${weekIndex}`}>
					{week.map((props, dayIndex) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: day position is stable in week
						<CalendarTableTd key={`day-${weekIndex}-${dayIndex}`} {...props} />
					))}
				</tr>
			))}
		</tbody>
	);
}

export { CalendarTableBody };

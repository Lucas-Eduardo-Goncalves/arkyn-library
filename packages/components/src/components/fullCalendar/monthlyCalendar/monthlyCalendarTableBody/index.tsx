import { useFullCalendar } from "../../_fullCalendarProvider";
import { MonthlyCalendarTableTd } from "../monthlyCalendarTableTd";
import "./styles.css";

function MonthlyCalendarTableBody() {
	const fullCalendar = useFullCalendar();

	return (
		<tbody className="arkynMonthlyCalendarTableBody">
			{fullCalendar.listMonthlyMatrix.map((week, weekIndex) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: week position is stable in monthly matrix
				<tr key={weekIndex}>
					{week.map((props, dayIndex) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: day position is stable in week
						<MonthlyCalendarTableTd key={dayIndex} {...props} />
					))}
				</tr>
			))}
		</tbody>
	);
}

export { MonthlyCalendarTableBody };

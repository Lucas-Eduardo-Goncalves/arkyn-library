import { formatToCapitalizeFirstWordLetter } from "@arkyn/shared";
import { useFullCalendar } from "../../_fullCalendarProvider";
import "./styles.css";

function WeekCalendarTableHeader() {
	const { listWeek, listWeeklyMatrix } = useFullCalendar();
	const firstHourRow = listWeeklyMatrix[0] || [];

	return (
		<thead className="arkynWeekCalendarTableHeader">
			<tr>
				<th />
				{listWeek.map((day) => (
					<th key={day}>
						<div className="arkynWeekCalendarTableHeaderContent">
							<span>{formatToCapitalizeFirstWordLetter(day)}</span>
							<strong>{firstHourRow[index]?.day}</strong>
						</div>
					</th>
				))}
			</tr>
		</thead>
	);
}

export { WeekCalendarTableHeader };

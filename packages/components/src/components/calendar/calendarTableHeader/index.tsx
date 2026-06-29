import { formatToCapitalizeFirstWordLetter } from "@arkyn/shared";
import { useCalendar } from "../_calendarProvider";
import "./styles.css";

function CalendarTableHeader() {
	const { listWeek } = useCalendar();

	return (
		<thead className="arkynCalendarTableHeader">
			<tr>
				{listWeek.map((day, index) => (
					<th key={index}>{formatToCapitalizeFirstWordLetter(day)}</th>
				))}
			</tr>
		</thead>
	);
}

export { CalendarTableHeader };

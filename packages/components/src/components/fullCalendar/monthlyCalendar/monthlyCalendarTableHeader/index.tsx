import { formatToCapitalizeFirstWordLetter } from "@arkyn/shared";
import { useFullCalendar } from "../../_fullCalendarProvider";
import "./styles.css";

function MonthlyCalendarTableHeader() {
	const { listWeek } = useFullCalendar();

	return (
		<thead className="arkynMonthlyCalendarTableHeader">
			<tr>
				{listWeek.map((day) => (
					<th key={day}>{formatToCapitalizeFirstWordLetter(day)}</th>
				))}
			</tr>
		</thead>
	);
}

export { MonthlyCalendarTableHeader };

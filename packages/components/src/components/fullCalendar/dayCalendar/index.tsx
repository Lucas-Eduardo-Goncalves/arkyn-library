import { useFullCalendar } from "../_fullCalendarProvider";
import { DayCalendarContainer } from "./dayCalendarContainer";
import { DayCalendarRow } from "./dayCalendarRow";

function DayCalendar() {
	const { listHours } = useFullCalendar();
	return (
		<DayCalendarContainer>
			{listHours.map((hour) => (
				<DayCalendarRow key={hour} hour={hour} timeInMinutes={hour} />
			))}
		</DayCalendarContainer>
	);
}

export { DayCalendar };

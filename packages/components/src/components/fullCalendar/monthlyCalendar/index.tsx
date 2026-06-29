import { MonthlyCalendarTableBody } from "./monthlyCalendarTableBody";
import { MonthlyCalendarTableContainer } from "./monthlyCalendarTableContainer";
import { MonthlyCalendarTableHeader } from "./monthlyCalendarTableHeader";

function MonthlyCalendar() {
	return (
		<MonthlyCalendarTableContainer>
			<MonthlyCalendarTableHeader />
			<MonthlyCalendarTableBody />
		</MonthlyCalendarTableContainer>
	);
}

export { MonthlyCalendar };

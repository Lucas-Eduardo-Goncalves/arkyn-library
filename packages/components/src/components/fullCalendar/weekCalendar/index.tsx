import { WeekCalendarTableBody } from "./weekCalendarTableBody";
import { WeekCalendarTableContainer } from "./weekCalendarTableContainer";
import { WeekCalendarTableHeader } from "./weekCalendarTableHeader";

function WeekCalendar() {
  return (
    <WeekCalendarTableContainer>
      <WeekCalendarTableHeader />
      <WeekCalendarTableBody />
    </WeekCalendarTableContainer>
  );
}

export { WeekCalendar };

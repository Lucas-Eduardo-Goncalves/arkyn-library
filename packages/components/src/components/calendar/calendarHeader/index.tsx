import { ChevronLeft, ChevronRight } from "lucide-react";

import { Select } from "../../select";
import { useCalendar } from "../_calendarProvider";
import "./styles.css";

type CalendarHeaderProps = {
	basicMode: boolean;
};

function CalendarHeader({ basicMode }: CalendarHeaderProps) {
	const calendar = useCalendar();

	if (basicMode) {
		return (
			<div className={`arkynCalendarHeader`}>
				<button
					className="arkynCalendarButton"
					onClick={() => calendar.previousMonth()}
				>
					<ChevronLeft />
				</button>

				<p>{calendar.currentDate}</p>

				<button
					className="arkynCalendarButton"
					onClick={() => calendar.nextMonth()}
				>
					<ChevronRight />
				</button>
			</div>
		);
	}

	return (
		<div className={`arkynCalendarHeader`}>
			<div>
				<button
					className="arkynCalendarButton"
					onClick={() => calendar.previousMonth()}
				>
					<ChevronLeft />
				</button>

				<button
					className="arkynCalendarButton"
					onClick={() => calendar.nextMonth()}
				>
					<ChevronRight />
				</button>
			</div>

			<div>
				<Select
					name="calendarMonth"
					variant="underline"
					className="calendarMonthSelect"
					value={calendar.currentMonth}
					options={calendar.listMonths}
					onChange={(value) => calendar.changeMonth(+value)}
				/>

				<Select
					name="calendarYear"
					variant="underline"
					className="calendarYearSelect"
					value={calendar.currentYear}
					options={calendar.listYears}
					onChange={(value) => calendar.changeYear(+value)}
				/>
			</div>
		</div>
	);
}

export { CalendarHeader };

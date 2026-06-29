import { formatToCapitalizeFirstWordLetter } from "@arkyn/shared";

type FullCalendarCell = {
	day: number;
	month: number;
	year: number;
	dayOwner: "previous" | "current" | "next";
};

type FullCalendarMatrix = FullCalendarCell[][];
type FullCalendarWeekCell = FullCalendarCell & {
	timeInMinutes: number;
};

type FullCalendarWeekMatrix = FullCalendarWeekCell[][];

class ViewService {
	capitalize(text: string) {
		return formatToCapitalizeFirstWordLetter(text);
	}

	listHours(range: [number, number]) {
		const [startHour, endHour] = range;
		const hours = [];

		for (
			let timeInMinutes = startHour * 60;
			timeInMinutes <= endHour * 60;
			timeInMinutes += 30
		) {
			hours.push(timeInMinutes);
		}

		return hours;
	}

	formatHourLabel(timeInMinutes: number) {
		const hour = Math.floor(timeInMinutes / 60);
		const minutes = timeInMinutes % 60;

		return `${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
	}

	getStartOfWeek(viewDate: Date) {
		const firstDayOfWeek = new Date(viewDate);
		firstDayOfWeek.setHours(0, 0, 0, 0);
		firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());

		return firstDayOfWeek;
	}

	listWeek(viewDate: Date, language: string) {
		const weekDays = [];
		const firstDayOfWeek = this.getStartOfWeek(viewDate);

		for (let i = 0; i < 7; i++) {
			const day = new Date(firstDayOfWeek);
			day.setDate(firstDayOfWeek.getDate() + i);
			const dayName = day.toLocaleDateString(language, {
				weekday: "short",
			});
			weekDays.push(dayName);
		}

		return weekDays;
	}

	listWeeklyMatrix(viewDate: Date, hours: number[]): FullCalendarWeekMatrix {
		const firstDayOfWeek = this.getStartOfWeek(viewDate);
		const viewMonth = viewDate.getMonth();

		return hours.map((hour) => {
			return Array.from({ length: 7 }, (_, index) => {
				const cellDate = new Date(firstDayOfWeek);
				cellDate.setDate(firstDayOfWeek.getDate() + index);

				let dayOwner: FullCalendarCell["dayOwner"] = "current";

				if (
					cellDate.getMonth() < viewMonth ||
					cellDate.getFullYear() < viewDate.getFullYear()
				) {
					dayOwner = "previous";
				}

				if (
					cellDate.getMonth() > viewMonth ||
					cellDate.getFullYear() > viewDate.getFullYear()
				) {
					dayOwner = "next";
				}

				return {
					day: cellDate.getDate(),
					month: cellDate.getMonth(),
					year: cellDate.getFullYear(),
					dayOwner,
					timeInMinutes: hour,
				};
			});
		});
	}

	listMonthlyMatrix(viewDate: Date) {
		const year = viewDate.getFullYear();
		const monthIndex = viewDate.getMonth();

		const firstDayOfMonth = new Date(year, monthIndex, 1);
		const firstWeekday = firstDayOfMonth.getDay();

		const daysInCurrentMonth = new Date(year, monthIndex + 1, 0).getDate();
		const daysInPreviousMonth = new Date(year, monthIndex, 0).getDate();

		const totalCells = Math.ceil((firstWeekday + daysInCurrentMonth) / 7) * 7;

		const weeks: FullCalendarMatrix = [];
		let currentMonthDay = 1;
		let nextMonthDay = 1;

		for (let i = 0; i < totalCells; i++) {
			const weekIndex = Math.floor(i / 7);
			if (!weeks[weekIndex]) weeks[weekIndex] = [];

			if (i < firstWeekday) {
				const day = daysInPreviousMonth - (firstWeekday - i - 1);
				const month = monthIndex === 0 ? 11 : monthIndex - 1;
				const cellYear = monthIndex === 0 ? year - 1 : year;

				weeks[weekIndex].push({
					day,
					month,
					year: cellYear,
					dayOwner: "previous",
				});
			} else if (currentMonthDay <= daysInCurrentMonth) {
				weeks[weekIndex].push({
					day: currentMonthDay,
					month: monthIndex,
					year: year,
					dayOwner: "current",
				});
				currentMonthDay++;
			} else {
				const month = monthIndex === 11 ? 0 : monthIndex + 1;
				const cellYear = monthIndex === 11 ? year + 1 : year;

				weeks[weekIndex].push({
					day: nextMonthDay,
					month,
					year: cellYear,
					dayOwner: "next",
				});
				nextMonthDay++;
			}
		}

		return weeks;
	}

	nextMonth(viewDate: Date, setViewDate: (date: Date) => void) {
		const nextViewDate = new Date(viewDate);
		nextViewDate.setMonth(nextViewDate.getMonth() + 1);
		setViewDate(nextViewDate);
	}

	nextWeek(viewDate: Date, setViewDate: (date: Date) => void) {
		const nextViewDate = new Date(viewDate);
		nextViewDate.setDate(nextViewDate.getDate() + 7);
		setViewDate(nextViewDate);
	}

	nextDay(viewDate: Date, setViewDate: (date: Date) => void) {
		const nextViewDate = new Date(viewDate);
		nextViewDate.setDate(nextViewDate.getDate() + 1);
		setViewDate(nextViewDate);
	}

	previousMonth(viewDate: Date, setViewDate: (date: Date) => void) {
		const nextViewDate = new Date(viewDate);
		nextViewDate.setMonth(nextViewDate.getMonth() - 1);
		setViewDate(nextViewDate);
	}

	previousWeek(viewDate: Date, setViewDate: (date: Date) => void) {
		const nextViewDate = new Date(viewDate);
		nextViewDate.setDate(nextViewDate.getDate() - 7);
		setViewDate(nextViewDate);
	}

	previousDay(viewDate: Date, setViewDate: (date: Date) => void) {
		const nextViewDate = new Date(viewDate);
		nextViewDate.setDate(nextViewDate.getDate() - 1);
		setViewDate(nextViewDate);
	}
}

export { type FullCalendarMatrix, type FullCalendarWeekMatrix, ViewService };

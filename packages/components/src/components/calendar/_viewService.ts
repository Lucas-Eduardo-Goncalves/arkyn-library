import { formatToCapitalizeFirstWordLetter } from "@arkyn/shared";

type CalendarCell = {
	day: number;
	month: number;
	year: number;
	dayType: "checkedDay" | "middleDay" | "uncheckedDay";
	dayOwner: "previous" | "current" | "next";
};

type CalendarMatrix = CalendarCell[][];

class ViewService {
	currentDay(viewDate: Date) {
		return String(viewDate.getDate()).padStart(2, "0");
	}

	currentMonth(viewDate: Date) {
		return String(viewDate.getMonth() + 1).padStart(2, "0");
	}

	currentYear(viewDate: Date) {
		return String(viewDate.getFullYear());
	}

	capitalize(text: string) {
		return formatToCapitalizeFirstWordLetter(text);
	}

	parseDayType(
		day: number,
		month: number,
		year: number,
		valueDate: [Date, Date],
	): "checkedDay" | "middleDay" | "uncheckedDay" {
		const firstDateDay = valueDate[0].getDate();
		const firstDateMonth = valueDate[0].getMonth();
		const firstDateYear = valueDate[0].getFullYear();

		const secondDateDay = valueDate[1].getDate();
		const secondDateMonth = valueDate[1].getMonth();
		const secondDateYear = valueDate[1].getFullYear();

		const firstDate = new Date(firstDateYear, firstDateMonth, firstDateDay);
		const secondDate = new Date(secondDateYear, secondDateMonth, secondDateDay);
		const currentDate = new Date(year, month, day);

		if (firstDate.getTime() === currentDate.getTime()) return "checkedDay";
		if (secondDate.getTime() === currentDate.getTime()) return "checkedDay";
		if (currentDate > firstDate && currentDate < secondDate) return "middleDay";
		return "uncheckedDay";
	}

	listWeek(language: string) {
		const weekDays = [];
		const firstSundayUtc = new Date(Date.UTC(2023, 0, 1));

		for (let i = 0; i < 7; i++) {
			const day = new Date(firstSundayUtc);
			day.setUTCDate(firstSundayUtc.getUTCDate() + i);
			const dayName = day.toLocaleDateString(language, {
				weekday: "short",
				timeZone: "UTC",
			});
			weekDays.push(dayName);
		}

		return weekDays;
	}

	listMonths(viewDate: Date, language: string) {
		const monthsByNavigatorLanguage = new Intl.DateTimeFormat(language, {
			month: "long",
		});

		return Array.from({ length: 12 }, (_, i) => {
			const date = new Date(viewDate.getFullYear(), i, 1);
			const label = monthsByNavigatorLanguage.format(date);
			return {
				label: this.capitalize(label),
				value: String(i).padStart(2, "0"),
			};
		});
	}

	listYears(lastYears: number) {
		const currentYear = new Date().getFullYear();

		return Array.from({ length: lastYears + 1 }, (_, i) => {
			const year = currentYear - lastYears + i;
			return { label: String(year), value: String(year) };
		}).reverse();
	}

	listMatrix(viewDate: Date, valueDate: [Date, Date]) {
		const year = viewDate.getFullYear();
		const monthIndex = viewDate.getMonth();

		const firstDayOfMonth = new Date(year, monthIndex, 1);
		const firstWeekday = firstDayOfMonth.getDay();

		const daysInCurrentMonth = new Date(year, monthIndex + 1, 0).getDate();
		const daysInPreviousMonth = new Date(year, monthIndex, 0).getDate();

		const totalCells = Math.ceil((firstWeekday + daysInCurrentMonth) / 7) * 7;

		const weeks: CalendarMatrix = [];
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
					dayType: this.parseDayType(day, month, cellYear, valueDate),
				});
			} else if (currentMonthDay <= daysInCurrentMonth) {
				weeks[weekIndex].push({
					day: currentMonthDay,
					month: monthIndex,
					year: year,
					dayOwner: "current",
					dayType: this.parseDayType(
						currentMonthDay,
						monthIndex,
						year,
						valueDate,
					),
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
					dayType: this.parseDayType(nextMonthDay, month, cellYear, valueDate),
				});
				nextMonthDay++;
			}
		}

		return weeks;
	}

	changeDay(
		day: number,
		month: number,
		year: number,
		calendarType: "single" | "range",
		valueDate: [Date, Date],
		setValueDate: (date: [Date, Date]) => void,
		setViewDate: (date: Date) => void,
	) {
		const normalizeDate = (date: Date) =>
			new Date(date.getFullYear(), date.getMonth(), date.getDate());

		const newDate = normalizeDate(new Date(year, month, day));
		setViewDate(newDate);

		if (calendarType === "single") {
			setValueDate([newDate, newDate]);
			return;
		}

		const startDate = normalizeDate(valueDate[0]);
		const endDate = normalizeDate(valueDate[1]);

		const newDateTime = newDate.getTime();
		const startDateTime = startDate.getTime();
		const endDateTime = endDate.getTime();

		if (newDateTime === startDateTime) {
			setValueDate([newDate, newDate]);
			return;
		}

		if (newDateTime === endDateTime) {
			setValueDate([newDate, newDate]);
			return;
		}

		if (newDate < startDate) {
			setValueDate([newDate, endDate]);
			return;
		}

		if (newDate > endDate) {
			setValueDate([startDate, newDate]);
			return;
		}

		const distanceToStart = Math.abs(newDateTime - startDateTime);
		const distanceToEnd = Math.abs(endDateTime - newDateTime);

		if (distanceToStart <= distanceToEnd) {
			setValueDate([newDate, endDate]);
			return;
		}

		setValueDate([startDate, newDate]);
	}

	changeMonth(
		month: number,
		viewDate: Date,
		setViewDate: (date: Date) => void,
	) {
		const nextViewDate = new Date(viewDate);
		nextViewDate.setMonth(month);
		setViewDate(nextViewDate);
	}

	changeYear(year: number, viewDate: Date, setViewDate: (date: Date) => void) {
		const nextViewDate = new Date(viewDate);
		nextViewDate.setFullYear(year);
		setViewDate(nextViewDate);
	}

	nextMonth(viewDate: Date, setViewDate: (date: Date) => void) {
		const nextViewDate = new Date(viewDate);
		nextViewDate.setDate(1);
		nextViewDate.setMonth(nextViewDate.getMonth() + 1);
		setViewDate(nextViewDate);
	}

	previousMonth(viewDate: Date, setViewDate: (date: Date) => void) {
		const nextViewDate = new Date(viewDate);
		nextViewDate.setDate(1);
		nextViewDate.setMonth(nextViewDate.getMonth() - 1);
		setViewDate(nextViewDate);
	}
}

export { type CalendarMatrix, ViewService };

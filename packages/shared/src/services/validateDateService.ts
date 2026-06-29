/**
 * Validates date components and input format strings for date-parsing utilities.
 * Enforces 4-digit years, month/day ranges, month-specific day counts, and leap year rules.
 *
 * @example
 * ```typescript
 * const service = new ValidateDateService();
 * service.validateDateParts(2024, 2, 29); // OK — leap year
 * service.validateDateParts(2023, 2, 29); // throws — not a leap year
 * service.validateInputFormat("brazilianDate"); // OK
 * service.validateInputFormat("custom"); // throws
 * ```
 */

class ValidateDateService {
	private isLeapYear(year: number): boolean {
		return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	}

	private getDaysInMonth(month: number, year: number): number {
		const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		if (month === 2 && this.isLeapYear(year)) return 29;
		return daysInMonth[month - 1];
	}

	private validateDayInMonth(day: number, month: number, year: number): void {
		const maxDays = this.getDaysInMonth(month, year);

		if (day > maxDays) {
			const monthNames = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			];

			const errorMessage = `Day ${day} is not valid for ${monthNames[month - 1]}`;
			const leapYearMessage = `Day ${day} is not valid for February ${year} (non-leap year)`;

			if (month === 2 && day === 29) throw new Error(leapYearMessage);
			throw new Error(errorMessage);
		}
	}

	/**
	 * Throws if year, month, or day are out of valid range or inconsistent with the calendar.
	 *
	 * @param year - 4-digit year (1000–9999).
	 * @param month - Month number (1–12).
	 * @param day - Day number (1–31, validated against the specific month).
	 */
	validateDateParts(year: number, month: number, day: number): void {
		const messageErrors = {
			year: "Year should be four digits",
			month: "Month should be between 1 and 12",
			day: "Day should be between 1 and 31",
		};

		if (`${year}`.length !== 4) throw new Error(messageErrors.year);
		if (month < 1 || month > 12) throw new Error(messageErrors.month);
		if (day < 1 || day > 31) throw new Error(messageErrors.day);

		this.validateDayInMonth(day, month, year);
	}

	/**
	 * Throws if `format` is not one of `"brazilianDate"`, `"isoDate"`, or `"timestamp"`.
	 *
	 * @param format - The format string to check.
	 */
	validateInputFormat(format: string): void {
		const validFormats = ["brazilianDate", "isoDate", "timestamp"];
		if (!validFormats.includes(format)) {
			throw new Error(`Invalid input format: ${format}`);
		}
	}
}

export { ValidateDateService };

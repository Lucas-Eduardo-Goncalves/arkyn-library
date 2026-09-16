/**
 * Validates date components and input format strings for date-parsing utilities.
 * Enforces 4-digit years, month/day ranges, month-specific day counts, and leap year rules.
 *
 * @example
 * ```typescript
 * const service = new ValidateDateService();
 * service.validateDateParts(2024, 2, 29); // OK, leap year
 * service.validateDateParts(2023, 2, 29); // throws, not a leap year
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
	 * Throws if `format` is not one of `"brazilianDate"`, `"isoDate"`, `"usDate"`, or `"timestamp"`.
	 *
	 * @param format - The format string to check.
	 */
	validateInputFormat(format: string): void {
		const validFormats = ["brazilianDate", "isoDate", "usDate", "timestamp"];
		if (!validFormats.includes(format)) {
			throw new Error(`Invalid input format: ${format}`);
		}
	}

	/**
	 * Splits `[year, month, day]` out of already-split numeric date parts
	 * according to `inputFormat`, and validates them via {@link validateDateParts}.
	 *
	 * Centralizes the date-part ordering shared by `parseToDate`, `formatDate`,
	 * and `validateDate` so it isn't duplicated (and can't drift) across packages.
	 *
	 * @param dateParts - The numeric date components in their format-specific order
	 * (e.g. `date.split(/[-/]/).map(Number)`).
	 * @param inputFormat - `"brazilianDate"` (DD/MM/YYYY), `"isoDate"`/`"usDate"`
	 * (MM-DD-YYYY — `"isoDate"` is a deprecated alias for `"usDate"`, see
	 * `DateInputFormat`), or `"timestamp"` (YYYY-MM-DD, the actual ISO 8601 date format).
	 * @returns `{ year, month, day }`.
	 */
	parseDateParts(
		dateParts: number[],
		inputFormat: DateInputFormat,
	): { year: number; month: number; day: number } {
		let day: number;
		let month: number;
		let year: number;

		switch (inputFormat) {
			case "brazilianDate":
				[day, month, year] = dateParts;
				break;
			case "isoDate":
			case "usDate":
				[month, day, year] = dateParts;
				break;
			case "timestamp":
				[year, month, day] = dateParts;
				break;
		}

		this.validateDateParts(year, month, day);

		return { year, month, day };
	}
}

/**
 * Parsing format accepted by `parseToDate`, `formatDate`, and `validateDate`:
 * - `"brazilianDate"`: DD/MM/YYYY
 * - `"usDate"`: MM-DD-YYYY
 * - `"isoDate"`: deprecated. Misnamed alias for `"usDate"` (MM-DD-YYYY) — despite
 *   the name, this is **not** ISO 8601. Kept for backward compatibility; use
 *   `"usDate"` instead. For real ISO 8601 dates (YYYY-MM-DD), use `"timestamp"`.
 * - `"timestamp"`: YYYY-MM-DD — the actual ISO 8601 date format.
 */
type DateInputFormat = "brazilianDate" | "isoDate" | "usDate" | "timestamp";

export { type DateInputFormat, ValidateDateService };

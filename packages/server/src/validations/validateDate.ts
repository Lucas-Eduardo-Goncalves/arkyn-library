import { ValidateDateService } from "@arkyn/shared";

/**
 * Validates a date string against a format and optional year bounds.
 *
 * @param date - The date string to validate.
 * @param config.inputFormat - Parsing format: `"brazilianDate"` (DD/MM/YYYY, default), `"isoDate"` (MM-DD-YYYY), or `"timestamp"` (YYYY-MM-DD).
 * @param config.minYear - Minimum allowed year. Defaults to 1900.
 * @param config.maxYear - Maximum allowed year. Defaults to 3000.
 * @returns `true` if the date is valid according to the format and bounds, otherwise `false`.
 *
 * @example
 * ```typescript
 * validateDate("31/12/2023"); // true
 * validateDate("2023-12-31", { inputFormat: "timestamp", minYear: 2000, maxYear: 2100 }); // true
 * validateDate("29/02/2023"); // false (not a leap year)
 * ```
 */

function validateDate(
	date: string,
	config?: {
		inputFormat?: "brazilianDate" | "isoDate" | "timestamp";
		minYear?: number;
		maxYear?: number;
	},
): boolean {
	const inputFormat = config?.inputFormat || "brazilianDate";
	const minYear = config?.minYear || 1900;
	const maxYear = config?.maxYear || 3000;

	const validateDateService = new ValidateDateService();
	validateDateService.validateInputFormat(inputFormat);

	let day: number, month: number, year: number;
	const dateParts = date.split(/[-/]/).map(Number);

	if (dateParts.length !== 3) return false;

	try {
		switch (inputFormat) {
			case "brazilianDate":
				[day, month, year] = dateParts;
				validateDateService.validateDateParts(year, month, day);
				break;
			case "isoDate":
				[month, day, year] = dateParts;
				validateDateService.validateDateParts(year, month, day);
				break;
			case "timestamp":
				[year, month, day] = dateParts;
				validateDateService.validateDateParts(year, month, day);
				break;
		}
		if (year < minYear || year > maxYear) return false;
		return true;
	} catch {
		return false;
	}
}

export { validateDate };
